import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';

interface MoodInputHomeProps {
    onAnalyze: (text: string, imageFile?: File) => void;
}

const MoodInputHome: React.FC<MoodInputHomeProps> = ({ onAnalyze }) => {
    const [text, setText] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText((prev) => prev + (prev ? ' ' : '') + transcript);
            setIsListening(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const quickMoods = [
        { label: 'Energetic', icon: '🔥' },
        { label: 'Calm', icon: '🌊' },
        { label: 'Lofi', icon: '🌙' },
        { label: 'Grunge', icon: '🎸' },
    ];

    return (
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
            {/* Top App Bar */}
            <div className="flex items-center p-6 pb-2 justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || "User"} className="aspect-square size-full object-cover" />
                        ) : (
                            <div className="bg-slate-200 dark:bg-slate-700 size-full flex items-center justify-center text-slate-500 dark:text-slate-300">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {user ? "Welcome back" : "Welcome"}
                        </p>
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
                            {user ? `Hi ${user.displayName?.split(' ')[0]} 👋` : "Guest"}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="flex px-3 py-1.5 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
                        >
                            Login
                        </button>
                    )}
                    <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="px-6 pt-8 pb-4 text-left">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-slate-900 dark:text-white text-[32px] font-bold leading-[1.1] tracking-tight"
                >
                    What's your <span className="text-primary">rhythm</span> today?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500 dark:text-slate-400 mt-2 text-base"
                >
                    Tell me how you feel, and I'll find the perfect YouTube soundtrack.
                </motion.p>
            </div>

            {/* Main Input Section */}
            <div className="flex flex-col gap-6 px-6 py-4">
                {/* Text Input Area */}
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 min-h-40 placeholder:text-slate-400 dark:placeholder:text-white/30 p-5 text-base font-normal leading-relaxed shadow-sm transition-all pb-12"
                            placeholder="I'm feeling a bit stressed but want something to help me focus..."
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <button
                                onClick={handleVoiceInput}
                                className={`flex items-center justify-center size-10 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                                title="Voice Input"
                            >
                                <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
                            </button>
                            <div className="text-primary opacity-50 p-2">
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => (text || imageFile) && onAnalyze(text, imageFile || undefined)}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                        disabled={!text && !imageFile}
                    >
                        <span className="material-symbols-outlined mr-2">psychology</span>
                        <span>Analyze Mood</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10"></div>
                    <span className="text-slate-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest">OR</span>
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10"></div>
                </div>

                {/* Visual Input Card */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button
                    onClick={triggerFileInput}
                    className="relative group overflow-hidden rounded-xl p-px transition-all hover:scale-[1.01] active:scale-[0.99] w-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#b066ff]"></div>
                    <div className="relative flex items-center gap-4 bg-white dark:bg-background-dark rounded-[calc(1rem-1px)] p-6 transition-colors group-hover:bg-transparent min-h-[100px]">
                        {imagePreview ? (
                            <div className="relative w-full flex items-center gap-4">
                                <img src={imagePreview} alt="Preview" className="size-16 rounded-lg object-cover border-2 border-white/20" />
                                <div className="text-left flex-1 min-w-0">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight truncate group-hover:text-white transition-colors">{imageFile?.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 group-hover:text-white/80 transition-colors">Tap Analyze to verify vibe</p>
                                </div>
                                <div
                                    onClick={removeImage}
                                    className="p-2 rounded-full hover:bg-white/20 text-slate-400 group-hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-white/20 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight group-hover:text-white transition-colors">Visual Analysis</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 group-hover:text-white/80 transition-colors">Capture or upload a photo of your vibe</p>
                                </div>
                                <div className="ml-auto text-slate-300 dark:text-white/20 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </div>
                            </>
                        )}
                    </div>
                </button>

                {/* Quick Mood Chips */}
                <div className="mt-2 text-left">
                    <p className="text-slate-400 dark:text-white/40 text-xs font-bold uppercase tracking-widest mb-3 px-1">Quick Moods</p>
                    <div className="flex flex-wrap gap-2">
                        {quickMoods.map((mood) => (
                            <button
                                key={mood.label}
                                onClick={() => setText(mood.label)}
                                className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                            >
                                {mood.icon} {mood.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Glows */}
            <div className="fixed top-[-10%] right-[-20%] size-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-20%] size-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
        </div>
    );
};

export default MoodInputHome;
