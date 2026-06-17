import { generateSEOContent } from './gemini';

type LLMTask = 'content' | 'code' | 'seo' | 'copy' | 'analysis';

const LLM_ROUTER: Record<LLMTask, 'gemini' | 'groq'> = {
  content: 'gemini',    // Blog AGC, article rewriting
  code: 'groq',         // Component generation, debugging
  seo: 'gemini',        // Keyword clustering, meta generation
  copy: 'groq',         // Headline, CTA, brand voice
  analysis: 'groq',     // Data interpretation, strategy
};

async function callGroq(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes('placeholder')) {
    throw new Error('Groq API Key is not set');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function routeLLM(task: LLMTask, prompt: string, systemInstruction?: string): Promise<string> {
  const model = LLM_ROUTER[task];
  
  if (model === 'gemini') {
    try {
      return await generateSEOContent(prompt, systemInstruction || 'Context: General SEO growth context');
    } catch (error) {
      console.warn('Primary Gemini failed, falling back to Groq...', error);
      try {
        return await callGroq(prompt, systemInstruction);
      } catch (groqError) {
        console.error('Groq fallback failed too', groqError);
        return `[API Offline] Draft content for: ${prompt}. (Gemini error: ${error instanceof Error ? error.message : String(error)})`;
      }
    }
  } else {
    try {
      return await callGroq(prompt, systemInstruction);
    } catch (error) {
      console.warn('Primary Groq failed, falling back to Gemini...', error);
      try {
        return await generateSEOContent(prompt, systemInstruction || 'Context: General SEO growth context');
      } catch (geminiError) {
        console.error('Gemini fallback failed too', geminiError);
        return `[API Offline] Draft content for: ${prompt}. (Groq error: ${error instanceof Error ? error.message : String(error)})`;
      }
    }
  }
}
