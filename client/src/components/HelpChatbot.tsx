import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import {
  CHAT_COPY,
  ChatLanguage,
  detectLanguage,
  findAnswers,
  getMarketplaceAnswer,
  HELP_ANSWERS,
  isLiveMarketplaceQuestion,
  LocalizedText,
  QUICK_QUESTIONS,
} from './helpKnowledge';
import { workerService } from '../services/workerService';

interface ChatMessage {
  id: number;
  question?: string;
  answerIds?: string[];
  liveAnswer?: LocalizedText;
  text?: string;
  language: ChatLanguage;
  isUser: boolean;
  isTyping?: boolean;
}

const getBrowserLanguage = (): ChatLanguage => {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language.toLowerCase().startsWith('hi') ? 'hi' : 'en';
};

export const HelpChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState<ChatLanguage>(getBrowserLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const nextMessageId = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const askQuestion = async (value: string) => {
    const trimmedQuestion = value.trim();
    if (!trimmedQuestion) return;

    const detectedLanguage = detectLanguage(trimmedQuestion);
    const userMessageId = nextMessageId.current++;
    const answerMessageId = nextMessageId.current++;
    const isLiveQuestion = isLiveMarketplaceQuestion(trimmedQuestion);
    setLanguage(detectedLanguage);
    setMessages((current) => [
      ...current,
      {
        id: userMessageId,
        question: trimmedQuestion,
        language: detectedLanguage,
        isUser: true,
      },
      {
        id: answerMessageId,
        text: isLiveQuestion
          ? detectedLanguage === 'hi' ? 'मार्केटप्लेस की वर्तमान जानकारी देखी जा रही है…' : detectedLanguage === 'hinglish' ? 'Current marketplace details check kar raha hoon…' : 'Checking current marketplace information…'
          : '',
        language: detectedLanguage,
        isUser: false,
        isTyping: isLiveQuestion,
      },
    ]);
    setQuestion('');

    try {
      const liveAnswer = isLiveQuestion
        ? getMarketplaceAnswer(trimmedQuestion, await workerService.getWorkers())
        : null;
      const answers = liveAnswer ? [] : findAnswers(trimmedQuestion);
      setMessages((current) => current.map((message) => {
        if (message.id !== answerMessageId) return message;
        if (liveAnswer) return { ...message, liveAnswer, text: undefined, isTyping: false };
        if (answers.length) {
          return {
            ...message,
            answerIds: answers.map((answer) => answer.id),
            text: undefined,
            isTyping: false,
          };
        }
        return {
          ...message,
          text: CHAT_COPY[detectedLanguage].fallback,
          isTyping: false,
        };
      }));
    } catch {
      const message = detectedLanguage === 'hi'
        ? 'अभी उपलब्ध वर्कर की जानकारी नहीं मिल सकी। कृपया कुछ देर बाद फिर कोशिश करें या वर्कर सूची खोलें।'
        : detectedLanguage === 'hinglish'
          ? 'Abhi listed workers ki details load nahi ho saki. Thodi der baad try karein ya worker listing kholein.'
          : 'I could not load current worker listings. Please try again shortly or browse the worker listings.';
      setMessages((current) => current.map((chatMessage) =>
        chatMessage.id === answerMessageId
          ? { ...chatMessage, text: message, isTyping: false }
          : chatMessage));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askQuestion(question);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-labelledby="help-chat-title"
          aria-modal="false"
          className="mb-3 flex h-[min(620px,calc(100dvh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
          role="dialog"
        >
          <header className="flex items-center justify-between bg-indigo-700 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="help-chat-title" className="text-sm font-bold">SERVIGO Help</h2>
                <p className="mt-0.5 text-xs text-indigo-100">
                  Auto: {CHAT_COPY[language].languageName} · Answers from the portal
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close help chat"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-indigo-100 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
              <p
                lang={language === 'hi' ? 'hi' : 'en'}
                className="max-w-[88%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
              >
                {CHAT_COPY[language].greeting}
              </p>
            </div>

            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-2.5 ${message.isUser ? 'justify-end' : ''}`}>
                {!message.isUser && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
                <div className={`max-w-[88%] space-y-2 ${message.isUser ? 'flex flex-col items-end' : ''}`}>
                  {message.question && (
                    <p
                      lang={message.language === 'hi' ? 'hi' : 'en'}
                      className="rounded-2xl rounded-tr-sm bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white"
                    >
                      {message.question}
                    </p>
                  )}
                  {message.liveAnswer && (
                    <div
                      lang={message.language === 'hi' ? 'hi' : 'en'}
                      className="whitespace-pre-line rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
                    >
                      <p>{message.liveAnswer[message.language]}</p>
                      <Link
                        to="/#workers-section"
                        onClick={() => setIsOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                      >
                        {message.language === 'hi' ? 'वर्कर प्रोफ़ाइल देखें' : message.language === 'hinglish' ? 'Worker profiles dekhein' : 'Browse worker profiles'}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                  {message.answerIds?.map((answerId) => {
                    const answer = HELP_ANSWERS.find((entry) => entry.id === answerId);
                    if (!answer) return null;
                    return (
                      <div
                        key={answer.id}
                        lang={message.language === 'hi' ? 'hi' : 'en'}
                        className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
                      >
                        <p>{answer.answer[message.language]}</p>
                        {answer.href && answer.linkLabel && (
                          <Link
                            to={answer.href}
                            onClick={() => setIsOpen(false)}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                          >
                            {answer.linkLabel[message.language]}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                  {message.text && (
                    <p
                      lang={message.language === 'hi' ? 'hi' : 'en'}
                      role={message.isTyping ? 'status' : undefined}
                      className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
                    >
                      {message.text}
                    </p>
                  )}
                </div>
                {message.isUser && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {messages.length === 0 && (
              <div className="space-y-2 pl-9">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {CHAT_COPY[language].popular}
                </p>
                {QUICK_QUESTIONS[language].map((quickQuestion) => (
                  <button
                    key={quickQuestion}
                    type="button"
                    onClick={() => askQuestion(quickQuestion)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {quickQuestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <label htmlFor="help-chat-question" className="sr-only">Ask SERVIGO Help</label>
            <input
              id="help-chat-question"
              ref={inputRef}
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={CHAT_COPY[language].placeholder}
              maxLength={500}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              aria-label="Send question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close help chat' : 'Open SERVIGO help chat'}
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-900/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
};
