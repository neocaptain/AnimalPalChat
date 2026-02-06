import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export const useAddToHomeScreen = () => {
    const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the default browser install prompt
            e.preventDefault();
            // Save the event so it can be triggered later
            setPromptInstall(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const installApp = async () => {
        if (!promptInstall) {
            return;
        }

        // Show the install prompt
        await promptInstall.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await promptInstall.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the saved prompt event
        setPromptInstall(null);
    };

    return { promptInstall, installApp };
};
