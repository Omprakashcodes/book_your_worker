import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { EvidencePhoto, bookingService } from '../services/bookingService';

interface BookingEvidenceGalleryProps {
  bookingId: string;
  kind: 'problem' | 'solution';
  photos: EvidencePhoto[];
}

export const BookingEvidenceGallery: React.FC<BookingEvidenceGalleryProps> = ({ bookingId, kind, photos }) => {
  const [loadedPhotos, setLoadedPhotos] = useState<Array<{ photo: EvidencePhoto; url: string }>>([]);
  const [hasError, setHasError] = useState(false);
  const [activePhoto, setActivePhoto] = useState<{ photo: EvidencePhoto; url: string } | null>(null);

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

  useEffect(() => {
    if (!activePhoto) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhoto(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activePhoto]);

  if (!photos.length) return null;

  return (
    <section className="md:col-span-2" aria-label={kind === 'problem' ? 'Problem photos' : 'Solution photos'}>
      <h3 className="mb-2 text-xs font-semibold text-slate-700">
        {kind === 'problem' ? 'Customer problem photos' : 'Worker solution photos'}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {loadedPhotos.map(({ photo, url }) => (
          <button key={photo.filename} type="button" onClick={() => setActivePhoto({ photo, url })} className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left">
            <img src={url} alt={photo.originalName} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02]" />
            <span className="block truncate px-2 py-1.5 text-[10px] text-slate-600">{photo.originalName}</span>
          </button>
        ))}
      </div>
      {hasError && <p className="mt-1 text-[11px] text-rose-600">Some photos could not be loaded.</p>}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActivePhoto(null);
          }}
        >
          <div className="relative flex max-h-full w-full max-w-5xl flex-col items-center">
            <div className="mb-3 flex w-full items-center justify-between gap-3 text-white">
              <p className="min-w-0 truncate text-sm font-medium">{activePhoto.photo.originalName}</p>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
                aria-label="Back to booking and close photo"
              >
                <X className="h-4 w-4" />
                <span>Back to booking</span>
              </button>
            </div>
            <img
              src={activePhoto.url}
              alt={activePhoto.photo.originalName}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};
