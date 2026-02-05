
import React, { useState, useEffect, useRef } from 'react';
import { AnimalType, Message, Language } from './types';
import { PERSONAS } from './constants';
import { geminiService } from './services/geminiService';
import PersonaSelector from './components/PersonaSelector';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AnimalType>(AnimalType.CAT);
  const [language, setLanguage] = useState<Language>(Language.KO);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Localized Custom Names State
  const [customNames, setCustomNames] = useState<Record<Language, Record<AnimalType, string>>>(() => {
    const saved = localStorage.getItem('animal_pal_localized_names');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse localized names", e);
      }
    }

    // Initial Defaults
    const defaults: Record<Language, Record<AnimalType, string>> = {
      [Language.KO]: {} as Record<AnimalType, string>,
      [Language.EN]: {} as Record<AnimalType, string>
    };

    Object.values(AnimalType).forEach(type => {
      defaults[Language.KO][type] = PERSONAS[type].nameKo;
      defaults[Language.EN][type] = PERSONAS[type].nameEn;
    });

    return defaults;
  });

  const persona = {
    ...PERSONAS[selectedType],
    name: customNames[language][selectedType],
    systemInstruction: PERSONAS[selectedType].systemInstruction.replace(
      /{NAME}/g,
      customNames[language][selectedType]
    )
  };

  const prevTypeRef = useRef<AnimalType>(selectedType);

  useEffect(() => {
    localStorage.setItem('animal_pal_localized_names', JSON.stringify(customNames));
  }, [customNames]);

  useEffect(() => {
    const isTypeChanged = prevTypeRef.current !== selectedType;

    // Pass existing history to AI so it maintains context with the new name/language
    geminiService.initChat(persona, language, isTypeChanged ? [] : messages);

    // Only reset messages if the animal type itself changed (e.g., Cat -> Dog)
    if (isTypeChanged || messages.length === 0) {
      const greeting = getInitialGreeting(selectedType, language, customNames[language][selectedType]);
      setMessages([{ id: 'init', role: 'model', text: greeting, timestamp: new Date() }]);
    }

    prevTypeRef.current = selectedType;
  }, [selectedType, language, customNames[language][selectedType]]);

  const handleUpdateName = (type: AnimalType, newName: string) => {
    setCustomNames(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [type]: newName
      }
    }));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    let fullResponse = '';

    // 스트리밍을 위해 빈 모델 메시지 미리 추가
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);

    try {
      const stream = geminiService.sendMessageStream(text);
      for await (const chunk of stream) {
        fullResponse += chunk;
        // 화면 텍스트 업데이트
        setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullResponse } : m));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  function getInitialGreeting(type: AnimalType, lang: Language, name: string): string {
    if (lang === Language.KO) {
      return `안녕! 나는 ${name}야! 🐾 반가워!`;
    } else {
      return `Hi! I'm ${name}! 🐾 Nice to meet you!`;
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-soft-cream)] flex flex-col items-center p-4 md:p-8 overflow-x-hidden font-['Spline_Sans']">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`p-3 rounded-full premium-card transition-all ${isSoundEnabled ? 'bg-[var(--color-warm-peach)] text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}
        >
          {isSoundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          )}
        </button>

        <div className="premium-card p-1.5 flex gap-2">
          <button onClick={() => setLanguage(Language.KO)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === Language.KO ? 'bg-[var(--color-warm-peach)] text-white' : 'text-gray-400 hover:text-gray-600'}`}>한국어</button>
          <button onClick={() => setLanguage(Language.EN)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === Language.EN ? 'bg-[var(--color-warm-peach)] text-white' : 'text-gray-400 hover:text-gray-600'}`}>English</button>
        </div>
      </div>

      <header className="w-full max-w-3xl mb-8 text-center px-4">
        <h1 className="text-[clamp(2rem,8vw,3.5rem)] font-bold text-gray-900 flex items-center justify-center gap-3 font-heading">
          <span className="animate-pulse drop-shadow-md">🐾</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
            {language === Language.KO ? '동물 짝꿍' : 'Critter Pal'}
          </span>
        </h1>
        <p className="font-elegant text-gray-500 italic mt-2 text-lg">
          {language === Language.KO ? '당신의 소중한 반려동물 친구와 대화해보세요.' : "Chat with your precious furry best friend."}
        </p>
      </header>

      <main className="w-full max-w-3xl premium-card overflow-hidden flex flex-col h-[600px] md:h-[750px] shadow-2xl relative">
        {/* Glass Header for Chat */}
        <div className="p-3 bg-white/50 border-b border-white/30 backdrop-blur-sm z-10 sticky top-0 overflow-x-auto no-scrollbar">
          <PersonaSelector
            selectedType={selectedType}
            onSelect={setSelectedType}
            language={language}
            customNames={customNames[language]}
            onUpdateName={handleUpdateName}
          />
        </div>

        <ChatWindow
          messages={messages}
          persona={persona}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          language={language}
        />
      </main>

    </div>
  );
};

export default App;
