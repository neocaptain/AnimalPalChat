
import React, { useState, useEffect, useRef } from 'react';
import { AnimalType, Message, Language, UserTier } from './types';
import { PERSONAS, TIER_CONFIGS } from './constants';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import PersonaSelector from './components/PersonaSelector';
import ChatWindow from './components/ChatWindow';
import InstallPrompt from './components/InstallPrompt';

const App: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AnimalType>(AnimalType.CAT);
  const [language, setLanguage] = useState<Language>(Language.KO);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // Tier Management (Currently FREE)
  const userTier = UserTier.FREE;
  const tierConfig = TIER_CONFIGS[userTier];

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

  // Persistence for Names
  useEffect(() => {
    localStorage.setItem('animal_pal_localized_names', JSON.stringify(customNames));
  }, [customNames]);

  // Load and Init Chat
  useEffect(() => {
    const initApp = async () => {
      const isTypeChanged = prevTypeRef.current !== selectedType;

      // 1. Load historical messages from storage (Flexible persistence layer)
      let history = await storageService.loadMessages(selectedType, language);

      // 2. If no history or type changed, add greeting
      if (history.length === 0 || isTypeChanged) {
        const greeting = getInitialGreeting(selectedType, language, customNames[language][selectedType]);
        history = [{ id: 'init', role: 'model', text: greeting, timestamp: new Date() }];
        await storageService.saveMessages(selectedType, language, history);
      }

      setMessages(history);

      // 3. Initialize AI with ONLY the recent context
      // This is the cost-saving step: messages.slice(-contextSize)
      const aiContext = history.slice(-tierConfig.contextSize);
      geminiService.initChat(persona, language, aiContext, tierConfig.responseLengthTitle);

      prevTypeRef.current = selectedType;
    };

    initApp();
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

    // Optimistic update
    setMessages(prev => {
      const updated = [...prev, userMsg];
      // Enforce max storage size
      const capped = updated.slice(-tierConfig.maxStorageSize);
      storageService.saveMessages(selectedType, language, capped);
      return capped;
    });

    setIsTyping(true);
    let fullResponse = '';
    const modelMsgId = (Date.now() + 1).toString();

    // Placeholder for model response
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);

    try {
      const stream = geminiService.sendMessageStream(text);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullResponse } : m));
      }

      // Save complete conversation
      setMessages(prev => {
        const capped = prev.slice(-tierConfig.maxStorageSize);
        storageService.saveMessages(selectedType, language, capped);
        return capped;
      });
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
    <div className="h-[100dvh] bg-[var(--color-soft-cream)] flex flex-col items-center p-2 md:p-8 overflow-hidden font-['Spline_Sans']">
      {/* Top Controls: Sound & Language */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-2 md:mb-6 px-2">
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`p-2.5 rounded-full premium-card transition-all ${isSoundEnabled ? 'bg-[var(--color-warm-peach)] text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}
        >
          {isSoundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          )}
        </button>

        <div className="premium-card p-1 flex gap-1">
          <button onClick={() => setLanguage(Language.KO)} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === Language.KO ? 'bg-[var(--color-warm-peach)] text-white' : 'text-gray-400 hover:text-gray-600'}`}>한국어</button>
          <button onClick={() => setLanguage(Language.EN)} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === Language.EN ? 'bg-[var(--color-warm-peach)] text-white' : 'text-gray-400 hover:text-gray-600'}`}>EN</button>
        </div>
      </div>

      <header className="w-full max-w-3xl mb-3 md:mb-8 text-center px-4 shrink-0">
        <h1 className="text-[clamp(1.5rem,6vw,3.5rem)] font-bold text-gray-900 flex items-center justify-center gap-2 font-heading">
          <span className="animate-pulse drop-shadow-sm">🐾</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
            {language === Language.KO ? '동물 짝꿍' : 'Critter Pal'}
          </span>
        </h1>
      </header>

      <main className="w-full max-w-3xl premium-card overflow-hidden flex flex-col flex-1 min-h-0 shadow-2xl relative mb-2">
        {/* Glass Header for Chat */}
        <div className="p-2 bg-white/50 border-b border-white/30 backdrop-blur-sm z-10 sticky top-0 overflow-x-auto no-scrollbar shrink-0">
          <PersonaSelector
            selectedType={selectedType}
            onSelect={setSelectedType}
            language={language}
            customNames={customNames[language]}
            onUpdateName={handleUpdateName}
          />
        </div>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          <ChatWindow
            messages={messages}
            persona={persona}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            language={language}
          />
        </div>
      </main>
      <InstallPrompt />
    </div>
  );
};

export default App;
