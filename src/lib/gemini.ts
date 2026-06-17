import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const GEMINI_MODELS = {
  fast: 'gemini-1.5-flash',        // AGC content, SEO articles
  pro: 'gemini-1.5-pro',           // Complex analysis, long-form
};

export async function generateSEOContent(keyword: string, context: string) {
  if (!genAI) {
    return `[Gemini API Key missing] Placeholder article content for: ${keyword}`;
  }
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_MODELS.fast,
    systemInstruction: `Kamu adalah SEO content writer ahli untuk pasar Indonesia. 
    Tulis konten yang memenuhi E-E-A-T Google dengan struktur:
    - H1 mengandung keyword utama
    - FAQ section dengan 5 PAA questions
    - Kesimpulan dengan CTA soft-sell
    Tone: Profesional, edukatif, conversational.`
  });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `Keyword: ${keyword}\nKonteks bisnis: ${context}\n\nBuat artikel SEO 800-1200 kata.` }]
    }]
  });

  return result.response.text();
}

// Google Search Grounding (Gemini eksklusif)
export async function groundedSearch(query: string) {
  if (!genAI) {
    return {
      text: `[Gemini API Key missing] Placeholder search results for: ${query}`,
      groundingMetadata: {}
    };
  }
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: [{ googleSearch: {} } as any],
  });

  const result = await model.generateContent(query);
  return {
    text: result.response.text(),
    groundingMetadata: result.response.candidates?.[0]?.groundingMetadata
  };
}
