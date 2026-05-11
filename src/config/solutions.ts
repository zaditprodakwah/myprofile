export interface SolutionTemplate {
  slug: string;
  title: string;
  description: string;
  category: "marketing" | "academic" | "business";
  painPoints: string[];
  features: string[];
}

export const solutionsData: SolutionTemplate[] = [
  {
    slug: "social-media-strategy-audit",
    title: "Audit Strategi Media Sosial & Digital Branding",
    description: "Evaluasi mendalam performa digital Anda untuk menemukan celah pertumbuhan dan efisiensi biaya iklan.",
    category: "marketing",
    painPoints: [
      "Engagement rate yang terus menurun",
      "Biaya iklan (CAC) yang tidak masuk akal",
      "Konten yang tidak memiliki identitas visual",
    ],
    features: [
      "Competitor Benchmarking",
      "Content Pillars Recommendation",
      "Ad-Account Structure Audit",
    ]
  },
  {
    slug: "academic-data-processing",
    title: "Olah Data Akademik & Analisis Statistik",
    description: "Transformasi data mentah menjadi temuan riset yang valid menggunakan metodologi matematika murni.",
    category: "academic",
    painPoints: [
      "Kebingungan memilih uji statistik yang tepat",
      "Data outlier yang merusak hasil riset",
      "Deadline publikasi yang semakin dekat",
    ],
    features: [
      "Uji Validitas & Reliabilitas",
      "Regresi Linear & Non-Linear",
      "Visualisasi Data Professional",
    ]
  },
  {
    slug: "executive-business-proposal",
    title: "Penyusunan Proposal Bisnis & Pitch Deck",
    description: "Dokumen strategis yang dirancang untuk memenangkan investasi dan kemitraan tingkat tinggi.",
    category: "business",
    painPoints: [
      "Ide bisnis yang sulit dikomunikasikan",
      "Proyeksi keuangan yang tidak realistis",
      "Tampilan presentasi yang amatir",
    ],
    features: [
      "Market Sizing (TAM/SAM/SOM)",
      "Revenue Modeling",
      "Executive Summary Writing",
    ]
  }
];

export const regions = ["Jakarta", "Bandung", "Surabaya", "Indonesia"];
