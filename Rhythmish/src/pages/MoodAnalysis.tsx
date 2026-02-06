import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


interface MoodAnalysisProps {
    onComplete: () => void;
    onCancel: () => void;
}

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ onComplete, onCancel }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
            {/* Top App Bar */}
            <div className="flex items-center px-6 py-4 justify-between z-10">
                <button
                    onClick={onCancel}
                    className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-white/10 backdrop-blur-md"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white text-2xl">arrow_back_ios_new</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-semibold leading-tight tracking-tight text-center flex-1 pr-10">AI Mood Analysis</h2>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
                {/* Animated Background Glows */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] orb-pulse opacity-60"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Central Visual Element */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* Outer Rings */}
                        <motion.div
                            animate={{ scale: [1.1, 1.2, 1.1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute inset-0 border-2 border-primary/20 rounded-full"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-4 border border-primary/40 rounded-full"
                        />
                        {/* Core Icon */}
                        <div className="relative w-40 h-40 bg-primary/20 backdrop-blur-2xl rounded-full flex items-center justify-center border border-primary/30 glow-effect">
                            <motion.span
                                animate={{ rotateY: [0, 180, 360] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                className="material-symbols-outlined text-primary text-[80px] leading-none"
                            >
                                psychology
                            </motion.span>
                        </div>
                        {/* Floating Particles */}
                        <motion.div
                            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute top-0 right-0 p-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
                        >
                            <span className="material-symbols-outlined text-primary text-sm">music_note</span>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute bottom-8 left-0 p-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
                        >
                            <span className="material-symbols-outlined text-blue-400 text-sm">auto_awesome</span>
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <div className="mt-12 text-center space-y-4 max-w-xs">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Analyzing your emotions...</h1>
                        <p className="text-slate-500 dark:text-white/60 text-lg font-medium leading-relaxed italic">Finding the perfect melody for you...</p>
                    </div>
                </div>

                {/* Progress Information Card */}
                <div className="mt-16 w-full max-w-sm z-10">
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex flex-col">
                                <span className="text-slate-400 dark:text-white/50 text-xs uppercase tracking-widest font-bold text-left">Current Step</span>
                                <span className="text-slate-700 dark:text-white font-medium">Neural processing in progress</span>
                            </div>
                            <span className="text-primary font-bold text-lg">{progress}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(127,13,242,0.6)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        {/* Steps Timeline */}
                        <div className="mt-6 flex justify-between px-2">
                            <div className="flex flex-col items-center gap-1">
                                <div className={`size-2 rounded-full transition-colors ${progress >= 30 ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}></div>
                                <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase">Input</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className={`size-2 rounded-full transition-all ${progress >= 30 && progress < 100 ? 'bg-primary ring-4 ring-primary/20' : progress >= 100 ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}></div>
                                <span className="text-[10px] text-slate-400 dark:text-white/80 font-bold uppercase">Analysis</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className={`size-2 rounded-full transition-colors ${progress >= 100 ? 'bg-primary' : 'bg-slate-300 dark:bg-white/20'}`}></div>
                                <span className="text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase">Output</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Action Area */}
            <div className="p-8 z-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 py-3 px-6 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                    <span className="material-symbols-outlined text-primary text-xl">youtube_activity</span>
                    <span className="text-slate-600 dark:text-white/80 text-sm font-medium">Scanning 1.2M+ Tracks...</span>
                </div>
                <button
                    onClick={onCancel}
                    className="mt-4 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-colors text-sm font-semibold uppercase tracking-widest"
                >
                    Cancel Analysis
                </button>
            </div>

            {/* Decorative Background Image Overlay */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover opacity-10"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDHVrUitqc9MH-e7A65RksOcRZ55IzqheM1lbu7PO9LCCdbv2g2kAIgZKlZ1wBJhXTH7ddCxscWfzL66_QZB6j7M6makogy-4DdC7Skk9ylDjuIGbxBcUyNNkA2rtzVKnOvm2KfAwKRlTxrbkzkGyQYdVMXFvrJ5XIHiIuMeK5cpZjCcfqYKmLpuPx-4SSuKwk3S0XaoDk7mUTj_kXmz8RWlW4DGuLy8dxDYx4msDnBbV-rXC3vvGv2W8OHCN5tFFZ837GfrK_tnhpH")' }}
                />
            </div>
        </div>
    );
};

export default MoodAnalysis;
