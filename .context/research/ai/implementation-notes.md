# Implementation Notes: AI ENGINEERING & AGENTS

Blueprints for setting up fallback routes and structured schemas.

## Multi-LLM Fallback Routing Blueprint

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function executeAiTask(prompt: string, systemInstruction: string): Promise<string> {
  // Try GROQ first (fast, cheap)
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await groqResponse.json();
    if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  } catch (error) {
    console.warn('Groq failed, running Gemini fallback...');
  }

  // Fallback to Gemini
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Action Plan
1. Configure fallback API calls inside `src/lib/llm-router.ts`.
2. Build Mastra workflows to automate content updates.
3. Setup Assistant UI components on client layouts.
