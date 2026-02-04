
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

export interface Persona {
  type: AnimalType;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  voiceName: string;
  systemInstruction: string;
}
