
import { GoogleGenAI, Modality } from "@google/genai";
import { Persona, Language } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: any = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public initChat(persona: Persona, language: Language, history: any[] = [], responseLength: string = '1~2 sentences') {
    const langInstruction = language === Language.KO
      ? "모든 답변은 반드시 한국어로만 작성하세요."
      : "Respond only in English.";

    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `${persona.systemInstruction}\n\nIMPORTANT: ${langInstruction} 답변은 항상 ${responseLength} 이내로 짧고 간결하게 작성하세요.`,
      },
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });
  }

  public async *sendMessageStream(text: string) {
    if (!this.chat) throw new Error("Chat not initialized");
    const result = await this.chat.sendMessageStream({ message: text });
    for await (const chunk of result) {
      yield chunk.text;
    }
  }

  public async speak(text: string, persona: Persona) {
    if (!text.trim()) return;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this naturally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: persona.voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        await this.playBase64Audio(base64Audio);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  }

  private async playBase64Audio(base64: string) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBuffer = await this.decodeAudioData(bytes, this.audioContext, 24000, 1);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  private async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}

export const geminiService = new GeminiService();
