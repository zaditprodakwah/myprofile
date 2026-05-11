import { Groq } from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Advanced Spintax Logic
const spin = (text: string) => {
  const matches = text.match(/\{[^{}]+\}/g);
  if (!matches) return text;
  
  let result = text;
  matches.forEach(match => {
    const options = match.slice(1, -1).split('|');
    const choice = options[Math.floor(Math.random() * options.length)];
    result = result.replace(match, choice);
  });
  return result;
};

const templates = {
  marketing: {
    intro: "{Dalam lanskap digital yang terus berubah,|Melihat pergerakan algoritma saat ini,|Sebagai Full-Stack Architect,} insight mengenai {topik} ini sangat krusial untuk {strategi growth|dominasi market|optimasi konversi} Anda.",
    outro: "{Kesimpulannya,|Sintesis akhirnya,} adaptasi terhadap tren ini akan menentukan seberapa efisien {funnel|posisi SERP} Anda di kuartal mendatang."
  },
  academic: {
    intro: "{Dalam ranah penelitian kontemporer,|Meninjau standar akademik terbaru,|Sebagai konsultan riset,} temuan tentang {topik} ini memberikan fondasi kuat untuk {integritas metodologi|keunggalan literatur} Anda.",
    outro: "{Secara akademis,|Pada akhirnya,} integrasi perspektif ini akan memperkaya {diskusi tesis|kualitas publikasi} Anda."
  },
  business: {
    intro: "{Bagi para eksekutif dan pemegang keputusan,|Dalam konteks efisiensi bisnis,|Melihat prospek operasional,} dokumen mengenai {topik} ini adalah aset intelektual untuk {keunggulan kompetitif|pengambilan keputusan berbasis data}.",
    outro: "{Oleh karena itu,|Kesimpulannya,} memastikan sistem Anda siap menghadapi dinamika ini adalah investasi {jangka panjang|strategis} yang tepat."
  }
};

/**
 * Synthesize a full reader-ready version of a radar item
 * Includes opening framing, strategic takeaways, and closing insights.
 */
async function synthesizeReaderContent(item: { title: string; summary: string; tags: string[] }): Promise<{
  opening: string;
  takeaway: string;
  strategy: string;
  closing: string;
}> {
  const prompt = `
    Create an executive intelligence summary for: "${item.title}"
    Context: ${item.summary}
    Tags: ${item.tags.join(", ")}

    Return JSON with:
    - opening: 1-2 sentences framing why this matters for the specific industry.
    - takeaway: The single most important "so what" for a CEO.
    - strategy: A 3-step actionable strategy.
    - closing: A final authoritative thought on the future impact.
  `;

  try {
    if (!groq) throw new Error("Groq not initialized");
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Synthesis failed, using template spintax");
    return {
      opening: `Zadit Intelligence radar mendeteksi pergeseran signifikan dalam pola ${item.tags[0] || 'industri'}.`,
      takeaway: item.summary,
      strategy: "1. Monitor perkembangan secara intensif. 2. Evaluasi dampak internal. 3. Siapkan mitigasi strategis.",
      closing: "Kecepatan adaptasi terhadap intelligence ini akan menentukan dominasi market di kuartal mendatang."
    };
  }
}

async function getGroqSynthesis(title: string, mode: string) {
  if (!groq) return null;
  try {
    const prompt = `
      You are Zadit, a Senior Full-Stack Architect and Consultant. 
      Write a professional 2-sentence intro and 1-sentence outro for a news item titled "${title}".
      The tone should be executive, high-tech, and strategic.
      Current focus: ${mode}.
      Language: Indonesian (Formal/Professional).
      
      Format your response exactly as:
      INTRO: [Your intro here]
      OUTRO: [Your outro here]
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    const response = completion.choices[0]?.message?.content || "";
    const intro = response.match(/INTRO:\s*(.*)/)?.[1] || "";
    const outro = response.match(/OUTRO:\s*(.*)/)?.[1] || "";

    if (intro && outro) return { intro, outro, source: "groq" };
  } catch (e) {
    console.error("Groq failed:", e);
  }
  return null;
}

async function getGeminiSynthesis(title: string, mode: string) {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are Zadit, a Senior Full-Stack Architect and Consultant. 
      Write a professional 2-sentence intro and 1-sentence outro for a news item titled "${title}".
      The tone should be executive, high-tech, and strategic.
      Current focus: ${mode}.
      Language: Indonesian (Formal/Professional).
      
      Format your response exactly as:
      INTRO: [Your intro here]
      OUTRO: [Your outro here]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const intro = response.match(/INTRO:\s*(.*)/)?.[1] || "";
    const outro = response.match(/OUTRO:\s*(.*)/)?.[1] || "";

    if (intro && outro) return { intro, outro, source: "gemini" };
  } catch (e) {
    console.error("Gemini failed:", e);
  }
  return null;
}

export async function getSynthesis(title: string, category: string, mode: string = "neutral") {
  const selectedMode = (mode === "neutral" ? category.toLowerCase() : mode) as keyof typeof templates;
  const template = templates[selectedMode] || templates.marketing;

  // Strategy: Try Groq first, then Gemini, then Spintax
  let result = await getGroqSynthesis(title, selectedMode);
  if (!result) {
    result = await getGeminiSynthesis(title, selectedMode);
  }

  if (result) return result;

  // Fallback to Spintax
  const intro = spin(template.intro.replace("{topik}", title));
  const outro = spin(template.outro);

  return { intro, outro, source: "spintax" };
}
