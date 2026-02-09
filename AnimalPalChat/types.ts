
export enum AnimalType {
  CAT = 'CAT',
  DOG = 'DOG',
  KOALA = 'KOALA',
  RABBIT = 'RABBIT'
}

export enum Language {
  KO = 'KO',
  EN = 'EN'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface TierConfig {
  contextSize: number; // How many recent messages to send to AI
  maxStorageSize: number; // How many messages to store in DB/LocalStorage
  responseLengthTitle: string; // Textual instruction for AI (e.g., "within 3 sentences")
}

export interface Persona {
  type: AnimalType;
  nameKo: string;
  nameEn: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  voiceName: string;
  systemInstruction: string;
}
