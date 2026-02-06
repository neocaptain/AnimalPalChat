import React, { useState } from 'react';
import { useAddToHomeScreen } from '../hooks/useAddToHomeScreen';

const InstallPrompt: React.FC = () => {
    const { promptInstall, installApp, isIOS, isStandalone } = useAddToHomeScreen();
    const [showIOSHint, setShowIOSHint] = useState(false);

    // Don't show anything if already in PWA mode
    if (isStandalone) return null;

    // For Android/Chrome - Show if install prompt is available
    if (promptInstall) {
        return (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
                <div className="bg-white/95 backdrop-blur-md border border-warm-peach/20 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    }

    // For iOS - Show instructions when button is clicked or automatically
    if (isIOS) {
        return (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
                <div className="bg-white/95 backdrop-blur-md border border-warm-peach/20 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!showIOSHint ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-warm-peach rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 font-heading">동물 짝꿍 설치하기</h3>
                                    <p className="text-xs text-gray-500">iPhone에 앱을 추가해 보세요!</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowIOSHint(true)}
                                className="bg-warm-peach hover:bg-warm-peach/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                            >
                                방법 보기
                            </button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-700 leading-relaxed">
                            <p className="mb-2 font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                                iPhone 설치 방법:
                            </p>
                            <ol className="list-decimal list-inside space-y-1 text-xs">
                                <li>Safari 하단의 <strong>공유 버튼(사각형과 화살표)</strong>을 누릅니다.</li>
                                <li>리스트를 내려 <strong>'홈 화면에 추가'</strong>를 선택합니다.</li>
                                <li>우측 상단의 <strong>'추가'</strong>를 누르면 완료!</li>
                            </ol>
                            <button
                                onClick={() => setShowIOSHint(false)}
                                className="mt-3 w-full border border-gray-200 py-1.5 rounded-lg text-xs font-medium text-gray-500"
                            >
                                닫기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default InstallPrompt;

