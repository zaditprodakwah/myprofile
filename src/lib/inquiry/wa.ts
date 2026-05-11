export function generateWAMessage(data: {
  mode: string;
  industry: string;
  problem: string;
  budget: string;
  goal: string;
  message: string;
  source_page: string;
}) {
  const template = `Hello Zadit, saya ingin konsultasi.

Mode: ${data.mode}
Industry: ${data.industry}
Problem utama: ${data.problem}
Budget range: ${data.budget}

Tujuan saya:
${data.goal}

Kondisi saat ini:
${data.message}

Saya menemukan Anda dari: ${data.source_page}

Apakah saya bisa mendapatkan rekomendasi strategi + estimasi timeline?

Thanks.`;

  const phone = "6282316363177";
  return `https://wa.me/${phone}?text=${encodeURIComponent(template)}`;
}
