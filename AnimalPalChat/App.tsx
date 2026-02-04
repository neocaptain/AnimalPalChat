
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
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const persona = PERSONAS[selectedType];
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    geminiService.initChat(persona, language);
    const greeting = getInitialGreeting(selectedType, language);
    setMessages([{ id: 'init', role: 'model', text: greeting, timestamp: new Date() }]);
    
    // Greeting TTS
    if (isSoundEnabled) {
      geminiService.speak(greeting, persona);
    }
  }, [selectedType, language]);

  // 음성 재생 큐 처리
  const processAudioQueue = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    isPlayingRef.current = true;
    const text = audioQueueRef.current.shift();
    if (text) {
      await geminiService.speak(text, persona);
    }
    isPlayingRef.current = false;
    processAudioQueue();
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    let fullResponse = '';
    let currentSentence = '';
    
    // 스트리밍을 위해 빈 모델 메시지 미리 추가
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date() }]);

    try {
      const stream = geminiService.sendMessageStream(text);
      for await (const chunk of stream) {
        fullResponse += chunk;
        currentSentence += chunk;

        // 화면 텍스트 업데이트
        setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullResponse } : m));

        // 문장 종결자(. ! ? \n) 감지 시 TTS 큐에 추가
        if (/[.!?\n]/.test(chunk) && isSoundEnabled) {
          audioQueueRef.current.push(currentSentence.trim());
          currentSentence = '';
          processAudioQueue();
        }
      }

      // 남은 텍스트 처리
      if (currentSentence.trim() && isSoundEnabled) {
        audioQueueRef.current.push(currentSentence.trim());
        processAudioQueue();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  function getInitialGreeting(type: AnimalType, lang: Language): string {
    if (lang === Language.KO) {
      switch (type) {
        case AnimalType.CAT: return "야옹! 나는 모찌야. 🐾";
        case AnimalType.DOG: return "멍멍! 안녕! 나는 버디야! 🎾";
        case AnimalType.KOALA: return "안녕... 난 코아야. 좀 졸려. 🐨";
        case AnimalType.RABBIT: return "안녕... 나는 미미야. 반가워! 🐰";
        default: return "안녕!";
      }
    } else {
      switch (type) {
        case AnimalType.CAT: return "Meow! I'm Mochi. 🐾";
        case AnimalType.DOG: return "WOOF! HI! I'M BUDDY! 🎾";
        case AnimalType.KOALA: return "Hi... I'm Koa. Zzz. 🐨";
        case AnimalType.RABBIT: return "Hello... I'm Mimi. 🐰";
        default: return "Hello!";
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center p-3 md:p-6 overflow-x-hidden">
      <div className="w-full max-w-2xl flex justify-between items-center mb-2">
        <button 
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`p-1.5 rounded-full shadow-sm border border-gray-100 transition-all ${isSoundEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}
        >
          {isSoundEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </button>

        <div className="bg-white/80 backdrop-blur shadow-sm p-1 rounded-full border border-gray-100 flex gap-1">
          <button onClick={() => setLanguage(Language.KO)} className={`px-3 py-1 rounded-full text-[10px] font-bold ${language === Language.KO ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>한국어</button>
          <button onClick={() => setLanguage(Language.EN)} className={`px-3 py-1 rounded-full text-[10px] font-bold ${language === Language.EN ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>EN</button>
        </div>
      </div>

      <header className="w-full max-w-2xl mb-3 text-center px-2">
        <h1 className="text-[clamp(1.25rem,6vw,2rem)] font-bold text-gray-800 flex items-center justify-center gap-2">
          <span className="animate-bounce flex-shrink-0">🐾</span> 
          <span>{language === Language.KO ? '동물 친구 대화' : 'Animal Pal'}</span>
        </h1>
      </header>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[480px] md:h-[600px] border border-gray-100">
        <div className="p-2 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
          <PersonaSelector selectedType={selectedType} onSelect={setSelectedType} language={language} />
        </div>

        <ChatWindow 
          messages={messages} 
          persona={persona} 
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          language={language}
        />
      </div>

      <footer className="mt-4 text-gray-400 text-[10px]">
        Gemini 3 Flash • AI Stream
      </footer>
    </div>
  );
};

export default App;
