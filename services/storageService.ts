import { Message, AnimalType, Language } from '../types';

export interface StorageAdapter {
    saveMessages: (type: AnimalType, lang: Language, messages: Message[]) => Promise<void>;
    loadMessages: (type: AnimalType, lang: Language) => Promise<Message[]>;
}

class LocalStorageAdapter implements StorageAdapter {
    private getKey(type: AnimalType, lang: Language) {
        return `messages_${type}_${lang}`;
    }

    async saveMessages(type: AnimalType, lang: Language, messages: Message[]) {
        localStorage.setItem(this.getKey(type, lang), JSON.stringify(messages));
    }

    async loadMessages(type: AnimalType, lang: Language): Promise<Message[]> {
        const saved = localStorage.getItem(this.getKey(type, lang));
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            // Reconstitute dates
            return parsed.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp)
            }));
        } catch (e) {
            console.error("Failed to load messages", e);
            return [];
        }
    }
}

// FUTURE: Implement CloudStorageAdapter for Premium Users
// class CloudStorageAdapter implements StorageAdapter { ... }

export const storageService = new LocalStorageAdapter();
