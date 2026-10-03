import assert from 'node:assert/strict';
import test from 'node:test';
import {
  detectLanguage,
  findAnswers,
  getMarketplaceAnswer,
  HELP_ANSWERS,
  isLiveMarketplaceQuestion,
} from './helpKnowledge';
import type { WorkerProfile } from '../types';

const makeWorker = (overrides: Partial<WorkerProfile> = {}): WorkerProfile => ({
  _id: 'worker-id',
  phone: '0000000000',
  skills: ['Plumbing'],
  experience: 5,
  address: 'Test address',
  city: 'Pune',
  state: 'Maharashtra',
  dailyWage: 800,
  verificationStatus: 'approved',
  userId: { _id: 'user-id', name: 'Test Worker', email: 'test@example.com' },
  ...overrides,
});

test('detects English, Hindi, and Hinglish questions', () => {
  assert.equal(detectLanguage('How can I book a worker?'), 'en');
  assert.equal(detectLanguage('वर्कर कैसे बुक करें?'), 'hi');
  assert.equal(detectLanguage('worker kaise book karu'), 'hinglish');
});

test('matches every authored user-style question to its intended help topic', () => {
  const missedQuestions: string[] = [];

  for (const answer of HELP_ANSWERS) {
    for (const questions of Object.values(answer.questions)) {
      for (const question of questions) {
        if (findAnswers(question)[0]?.id !== answer.id) {
          missedQuestions.push(`${answer.id}: ${question}`);
        }
      }
    }
  }

  assert.deepEqual(missedQuestions, []);
});

test('returns no answer for unrelated or unsupported questions instead of guessing', () => {
  assert.deepEqual(findAnswers('What is the weather tomorrow?'), []);
  assert.deepEqual(findAnswers('বাংলায় একজন কর্মী বুক করব কীভাবে?'), []);
});

test('matches common Hinglish shorthand, typos, and joined words from real user questions', () => {
  const cases = [
    { question: 'apayment kaise kre', expected: 'payment' },
    { question: 'payment kaise kre', expected: 'payment' },
    { question: 'a payment kaise kre', expected: 'payment' },
    { question: 'payment kese kare', expected: 'payment' },
    { question: 'payment krna hai', expected: 'payment' },
    { question: 'booking kaise kre', expected: 'book-worker' },
    { question: 'booking krna hai', expected: 'book-worker' },
    { question: 'abooking kaise krni hai', expected: 'book-worker' },
  ];

  for (const { question, expected } of cases) {
    assert.ok(
      findAnswers(question).some((answer) => answer.id === expected),
      `"${question}" should match the ${expected} answer`,
    );
    assert.equal(detectLanguage(question), 'hinglish', `"${question}" should be detected as Hinglish`);
  }
});

test('matches natural English questions with omitted helper words', () => {
  const cases = [
    { question: 'how i book worker', expected: 'book-worker' },
    { question: 'how do i book worker', expected: 'book-worker' },
    { question: 'how can i book worker', expected: 'book-worker' },
    { question: 'how i pay', expected: 'payment' },
    { question: 'how do i pay', expected: 'payment' },
    { question: 'how can i pay', expected: 'payment' },
    { question: 'how can i make payment', expected: 'payment' },
    { question: 'can i pay cash', expected: 'payment' },
  ];

  for (const { question, expected } of cases) {
    assert.ok(
      findAnswers(question).some((answer) => answer.id === expected),
      `"${question}" should match the ${expected} answer`,
    );
  }
});

test('matches varied short, misspelled, and conversational questions to the right intent', () => {
  const cases = [
    { question: 'book worker', expected: 'book-worker' },
    { question: 'need book a worker', expected: 'book-worker' },
    { question: 'how can book worker', expected: 'book-worker' },
    { question: 'how i pay', expected: 'payment' },
    { question: 'pay by cash', expected: 'payment' },
    { question: 'online pay option', expected: 'payment' },
    { question: 'payment faild', expected: 'payment-failed' },
    { question: 'cancl bokking', expected: 'cancel-booking' },
    { question: 'when refund', expected: 'refund' },
    { question: 'worker regstration', expected: 'worker-registration' },
    { question: 'forgot passwrod', expected: 'login-password' },
    { question: 'booking statuz', expected: 'track-booking' },
    { question: 'reshedule my booking', expected: 'change-booking' },
    { question: 'upload picturs', expected: 'photos' },
  ];

  for (const { question, expected } of cases) {
    assert.equal(
      findAnswers(question)[0]?.id,
      expected,
      `"${question}" should rank ${expected} first`,
    );
  }
});

test('answers the exact joined-word examples users reported in Hinglish', () => {
  const paymentAnswer = findAnswers('apayment kaise kre').find((answer) => answer.id === 'payment');
  const bookingAnswer = findAnswers('booking kaise kre').find((answer) => answer.id === 'book-worker');

  assert.ok(paymentAnswer?.answer.hinglish.includes('Razorpay'));
  assert.ok(bookingAnswer?.answer.hinglish.includes('Worker profile'));
});

test('keeps translations available for every matched answer', () => {
  for (const answer of HELP_ANSWERS) {
    assert.ok(answer.answer.en.length > 0, `${answer.id} has English content`);
    assert.ok(answer.answer.hi.length > 0, `${answer.id} has Hindi content`);
    assert.ok(answer.answer.hinglish.length > 0, `${answer.id} has Hinglish content`);
  }
});

test('recognizes live marketplace questions separately from static FAQ questions', () => {
  for (const question of [
    'how many services',
    'who is available',
    'which plumber is available',
    'who is the most experienced electrician',
    'what are individual worker charges',
    'कितनी सेवाएं उपलब्ध हैं',
    'कौन सा प्लंबर उपलब्ध है',
    'सबसे अनुभवी वर्कर कौन है',
    'वर्कर का कितना चार्ज है',
    'कौन सा प्लंबर पुणे में उपलब्ध है',
  ]) {
    assert.equal(isLiveMarketplaceQuestion(question), true, `"${question}" should query live listings`);
  }

  assert.equal(isLiveMarketplaceQuestion('how do I book a worker'), false);
});

test('answers service count/list questions with actual approved worker skills', () => {
  const workers = [
    makeWorker({ skills: ['Plumbing', 'Pipe Repair'] }),
    makeWorker({ _id: 'worker-2', skills: ['plumbing', 'Electrical'] }),
    makeWorker({ _id: 'worker-3', skills: ['Cleaning'], verificationStatus: 'pending' }),
  ];
  const answer = getMarketplaceAnswer('how many services', workers);

  assert.ok(answer?.en.includes('7 main service categories'));
  assert.ok(answer?.en.includes('3 distinct skills are listed: Plumbing, Pipe Repair, Electrical'));
});

test('answers worker availability with approved matching workers and no false schedule promise', () => {
  const workers = [
    makeWorker(),
    makeWorker({ _id: 'worker-2', skills: ['Electrical'], verificationStatus: 'pending' }),
  ];
  const answer = getMarketplaceAnswer('which plumber is available', workers);

  assert.ok(answer?.en.includes('Test Worker'));
  assert.ok(answer?.en.includes('Pune, Maharashtra'));
  assert.ok(answer?.en.includes('₹800/day'));
  assert.ok(answer?.en.includes('does not confirm a free time slot'));
});

test('filters current worker availability by service and city', () => {
  const workers = [
    makeWorker({ _id: 'pune-plumber', userId: { _id: 'u1', name: 'Pune Plumber', email: 'pune@example.com' } }),
    makeWorker({ _id: 'mumbai-plumber', userId: { _id: 'u2', name: 'Mumbai Plumber', email: 'mumbai@example.com' }, city: 'Mumbai', state: 'Maharashtra' }),
    makeWorker({ _id: 'pune-electrician', userId: { _id: 'u3', name: 'Pune Electrician', email: 'electrician@example.com' }, skills: ['Electrical'] }),
  ];
  const answer = getMarketplaceAnswer('who is available plumber in Pune', workers);

  assert.ok(answer?.en.includes('Pune Plumber'));
  assert.ok(!answer?.en.includes('Mumbai Plumber'));
  assert.ok(!answer?.en.includes('Pune Electrician'));
});

test('ranks the most experienced matching worker and lists individual daily rates', () => {
  const workers = [
    makeWorker({ _id: 'worker-1', userId: { _id: 'user-1', name: 'New Plumber', email: 'new@example.com' }, experience: 2, dailyWage: 700 }),
    makeWorker({ _id: 'worker-2', userId: { _id: 'user-2', name: 'Senior Plumber', email: 'senior@example.com' }, experience: 12, dailyWage: 1200 }),
  ];
  const experienced = getMarketplaceAnswer('who is the most experienced plumber', workers);
  const rates = getMarketplaceAnswer('plumber individual charges', workers);

  assert.ok(experienced?.en.includes('12 years'));
  assert.ok(experienced?.en.includes('Senior Plumber'));
  assert.ok(!experienced?.en.includes('New Plumber'));
  assert.ok(rates?.en.includes('New Plumber'));
  assert.ok(rates?.en.includes('₹700/day'));
  assert.ok(rates?.en.includes('Senior Plumber'));
  assert.ok(rates?.en.includes('₹1,200/day'));
});

test('returns localized empty-list answers instead of inventing worker availability', () => {
  const answer = getMarketplaceAnswer('who is available', []);

  assert.ok(answer?.en.includes('No approved worker profiles'));
  assert.ok(answer?.hi.includes('अभी कोई स्वीकृत वर्कर'));
  assert.ok(answer?.hinglish.includes('Abhi koi approved worker'));
});
