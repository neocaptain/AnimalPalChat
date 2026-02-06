import React from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../services/ai';

interface RecommendedSongsProps {
    result: AnalysisResult;
    onBack: () => void;
    onRefresh: () => void;
}

const RecommendedSongs: React.FC<RecommendedSongsProps> = ({ result, onBack, onRefresh }) => {
    const { recommendations, headline } = result;

    const handlePlayOnYouTube = (searchQuery: string) => {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300 overflow-y-auto no-scrollbar">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200/50 dark:border-white/5">
                <button
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-start text-slate-700 dark:text-white"
                >
                    <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
                <h1 className="text-lg font-semibold tracking-tight">Sounds for your Mood</h1>
                <button className="w-10 h-10 flex items-center justify-end text-slate-700 dark:text-white">
                    <span className="material-symbols-outlined text-[24px]">tune</span>
                </button>
            </header>

            <main className="px-4 pb-32">
                <div className="py-6 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary text-left">Analyzed Mood</span>
                    </div>
                    <h2 className="text-3xl font-bold text-center tracking-tight text-slate-900 dark:text-white">{headline}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center max-w-[280px]">
                        {recommendations.length} tracks sorted by your mood match score.
                    </p>
                </div>

                <div className="space-y-4">
                    {recommendations.map((song, idx) => (
                        <motion.div
                            key={song.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white dark:bg-[#211b27] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 transition-all text-left"
                        >
                            <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${song.thumbnail}')` }}
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                                <button className="absolute top-3 left-3 size-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform z-10">
                                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                                </button>
                                <div className="absolute top-3 right-3 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
                                    <span className="material-symbols-outlined text-[14px] fill-1">bolt</span>
                                    <span>{song.matchScore}% Match</span>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-tighter">
                                    {song.duration}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{song.title}</h3>
                                        <div className="flex flex-wrap gap-1.5 mb-1">
                                            {song.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10">{tag}</span>
                                            ))}
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">{song.artist}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlePlayOnYouTube(song.searchQuery)}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">play_circle</span>
                                    <span>Play on YouTube</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="h-28"></div>
            </main>

            <div className="fixed bottom-6 left-0 right-0 px-6 z-50 max-w-[430px] mx-auto">
                <div className="flex gap-3">
                    <button
                        onClick={onRefresh}
                        className="flex-1 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 text-slate-900 dark:text-white font-semibold py-4 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        <span>Refine Mood</span>
                    </button>
                    <button className="size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 shrink-0">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pointer-events-none"></div>
        </div>
    );
};

export default RecommendedSongs;
