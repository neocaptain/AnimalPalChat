import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

if (!API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface Emotion {
    label: string;
    value: number;
    color: string;
    icon: string;
}

export interface SongRecommendation {
    id: string;
    title: string;
    artist: string;
    matchScore: number;
    tags: string[];
    thumbnail: string;
    duration: string;
    searchQuery: string;
}

export interface AnalysisResult {
    headline: string;
    emotions: Emotion[];
    recommendations: SongRecommendation[];
    summary: string;
}

export async function analyzeMood(userInput: string): Promise<AnalysisResult> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following user mood description and provide a structured JSON response for a music recommendation app called "Rhythmish".
    User Input: "${userInput}"

    The JSON must follow this exact structure:
    {
      "headline": "A short, catchy headline describing the mood (e.g., 'A bit nostalgic but hopeful')",
      "summary": "A one-sentence poetic analysis of why these songs were chosen (e.g., 'Your input suggests warm sunset hues...')",
      "emotions": [
        { "label": "Joy", "value": 30, "color": "text-yellow-400", "icon": "sentiment_very_satisfied" },
        { "label": "Calm", "value": 70, "color": "text-blue-400", "icon": "water_drop" },
        { "label": "Nostalgia", "value": 45, "color": "text-orange-400", "icon": "history" }
      ],
      "recommendations": [
        {
          "id": "1",
          "title": "Song Title",
          "artist": "Artist Name",
          "matchScore": 99,
          "tags": ["#Tag1", "#Tag2"],
          "thumbnail": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
          "duration": "3:45",
          "searchQuery": "Artist - Song Title official audio"
        }
      ]
    }

    Choose exactly 3 emotions that best fit the mood.
    Provide 3-5 song recommendations.
    For the thumbnail, use high-quality music/nature related Unsplash URLs or placeholder music art URLs.
    Ensure values are realistic.
    Return ONLY the raw JSON string.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON if it's wrapped in markdown
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Could not parse AI response as JSON");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw error;
    }
}
