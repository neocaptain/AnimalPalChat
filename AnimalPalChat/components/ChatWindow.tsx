
import React, { useState, useRef, useEffect } from 'react';
import { Message, Persona, Language } from '../types';

interface ChatWindowProps {
  messages: Message[];
  persona: Persona;
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  language: Language;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, persona, onSendMessage, isTyping, language }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = language === Language.KO ? 'ko-KR' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-transparent">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`relative group max-w-[80%] md:max-w-[70%]`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 ml-1">
                  <span className="text-xl drop-shadow-sm">{persona.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 font-heading">
                    {persona.name}
                  </span>
                </div>
              )}

              <div className={`
                p-4 rounded-[22px] shadow-sm text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-white text-gray-800 rounded-tr-none border border-white/50'
                  : 'bg-[var(--color-soft-mint)] text-gray-800 rounded-tl-none border border-[var(--color-soft-mint)]/50'}
              `}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {msg.role === 'user' && (
                <div className="text-right mt-1 mr-1">
                  <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">You</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-center gap-3 ml-1 animate-pulse">
            <span className="text-lg opacity-50">{persona.icon}</span>
            <div className="bg-[var(--color-soft-mint)]/50 rounded-full px-4 py-2 flex items-center gap-1.5 box-content">
              <div className="w-1.5 h-1.5 bg-[var(--color-warm-peach)] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[var(--color-warm-peach)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[var(--color-warm-peach)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Glassmorphism Input Area */}
      <div className="p-3 md:p-6 bg-white/40 backdrop-blur-md border-t border-white/20">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === Language.KO ? "메시지를 남겨주세요..." : "Write a message..."}
              className="w-full px-6 py-4 pr-14 rounded-full bg-white/80 border border-white/50 text-sm focus:outline-none focus:ring-4 focus:ring-[var(--color-warm-peach)]/20 transition-all placeholder:text-gray-400 shadow-inner"
              disabled={isTyping}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'text-gray-300 hover:text-[var(--color-warm-peach)] hover:bg-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className="w-14 h-14 rounded-full bg-[var(--color-warm-peach)] text-white flex items-center justify-center flex-shrink-0 disabled:bg-gray-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-2xl filter drop-shadow-md">🐾</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
