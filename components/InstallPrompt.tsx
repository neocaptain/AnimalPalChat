import React from 'react';
import { useAddToHomeScreen } from '../hooks/useAddToHomeScreen';

const InstallPrompt: React.FC = () => {
    const { promptInstall, installApp } = useAddToHomeScreen();

    if (!promptInstall) {
        return null;
    }

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
            <div className="bg-white/90 backdrop-blur-md border border-warm-peach/20 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warm-peach rounded-xl flex items-center justify-center text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 font-heading">동물 짝꿍 설치하기</h3>
                        <p className="text-xs text-gray-500">홈 화면에 추가하여 더 편하게 대화하세요!</p>
                    </div>
                </div>
                <button
                    onClick={installApp}
                    className="bg-warm-peach hover:bg-warm-peach/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                    추가하기
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
