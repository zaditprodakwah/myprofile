import { supabase } from "@/lib/supabase/client";

export async function generateSolutionContent(industrySlug: string, problemSlug: string) {
  const { data: problem } = await supabase
    .from("problems")
    .select("*, industries(*)")
    .eq("slug", problemSlug)
    .single();

  if (!problem) return null;

  // Use Spintax Template strategy
  const intro = `Di industri ${problem.industries.name}, menghadapi kendala seperti ${problem.title} adalah hal yang kritikal. Tanpa penanganan yang presisi, ini dapat menyebabkan kebocoran efisiensi hingga 40%.`;
  
  const strategy = [
    { title: "Audit & Identifikasi Akar Masalah", content: "Langkah pertama adalah melakukan audit menyeluruh menggunakan data sekunder dan primer untuk menemukan bottleneck utama." },
    { title: "Implementasi Framework Zadit", content: "Kami menerapkan framework proprietary kami yang menggabungkan AI-driven insights dengan eksekusi operasional yang agile." },
    { title: "Skalabilitas & Otomatisasi", content: "Setelah solusi stabil, kami membangun sistem otomasi agar hasil yang dicapai dapat direplikasi secara konsisten." }
  ];

  const faqs = [
    { q: `Berapa lama waktu untuk menyelesaikan ${problem.title}?`, a: "Biasanya berkisar antara 2-6 minggu tergantung kompleksitas infrastruktur Anda." },
    { q: "Apakah ini memerlukan investasi tools tambahan?", a: "Kami selalu mengutamakan efisiensi dengan memaksimalkan tech stack yang sudah ada, namun akan merekomendasikan tool spesifik jika diperlukan." }
  ];

  return {
    title: `Strategi Mengatasi ${problem.title} dalam ${problem.industries.name}`,
    description: problem.solution_summary,
    intro,
    strategy,
    faqs,
    tags: problem.tags
  };
}
