import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect",
  description: "Portofolio & Growth Engine Muhammad Khoiruzzadittaqwa (Zadit) - Full-Stack Growth Architect. Spesialis SEO teknikal, copywriting konversi, dan rekayasa web terukur.",
  metadataBase: new URL("https://zadit.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect",
    description: "Portofolio & Growth Engine Muhammad Khoiruzzadittaqwa (Zadit) - Full-Stack Growth Architect. Spesialis SEO teknikal, copywriting konversi, dan rekayasa web terukur.",
    url: "https://zadit.dev",
    siteName: "Zadit Growth Portfolio",
    images: [
      {
        url: "/og-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammad Khoiruzzadittaqwa - Full-Stack Growth Architect",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Muhammad Khoiruzzadittaqwa",
    "alternateName": ["Zadit", "Aditt", "Muhzadit"],
    "jobTitle": "Full-Stack Growth Architect",
    "description": "Spesialis SEO teknikal, copywriting konversi, dan strategi digital marketing dengan pengalaman 10+ tahun sejak 2015.",
    "url": "https://zadit.dev",
    "image": "https://zadit.dev/og-profile.jpg",
    "knowsAbout": [
      "SEO Teknikal", "AEO", "GEO", "Copywriting",
      "Digital Marketing", "Brand Strategy", "Content Marketing",
      "Administrative Management", "Broadcasting"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Fullstack Digital Marketing",
        "credentialCategory": "certificate",
        "recognizedBy": { "@type": "Organization", "name": "MySkill.id" }
      }
    ],
    "sameAs": [
      "https://github.com/muhzadit",
      "https://www.linkedin.com/in/muhzadit",
      "https://kontak.link/muhzadit",
      "https://id.wikipedia.org/wiki/Pemasaran_digital"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Al-Bahjah Foundation",
      "url": "https://albahjah.or.id"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-alabaster text-text-primary font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}


