import React, { useEffect, useState } from 'react';
import { EvidencePhoto, bookingService } from '../services/bookingService';

interface BookingEvidenceGalleryProps {
  bookingId: string;
  kind: 'problem' | 'solution';
  photos: EvidencePhoto[];
}

export const BookingEvidenceGallery: React.FC<BookingEvidenceGalleryProps> = ({ bookingId, kind, photos }) => {
  const [loadedPhotos, setLoadedPhotos] = useState<Array<{ photo: EvidencePhoto; url: string }>>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const objectUrls: string[] = [];
    setLoadedPhotos([]);
    setHasError(false);

    Promise.all(photos.map(async (photo) => {
      try {
        const url = await bookingService.getEvidenceObjectUrl(bookingId, kind, photo.filename);
        objectUrls.push(url);
        return { photo, url };
      } catch {
        if (isMounted) setHasError(true);
        return null;
      }
    })).then((results) => {
      if (isMounted) setLoadedPhotos(results.filter((result): result is { photo: EvidencePhoto; url: string } => result !== null));
    });

    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bookingId, kind, photos]);

  if (!photos.length) return null;

  return (
    <section className="md:col-span-2" aria-label={kind === 'problem' ? 'Problem photos' : 'Solution photos'}>
      <h3 className="mb-2 text-xs font-semibold text-slate-700">
        {kind === 'problem' ? 'Customer problem photos' : 'Worker solution photos'}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {loadedPhotos.map(({ photo, url }) => (
          <a key={photo.filename} href={url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img src={url} alt={photo.originalName} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02]" />
            <span className="block truncate px-2 py-1.5 text-[10px] text-slate-600">{photo.originalName}</span>
          </a>
        ))}
      </div>
      {hasError && <p className="mt-1 text-[11px] text-rose-600">Some photos could not be loaded.</p>}
    </section>
  );
};
