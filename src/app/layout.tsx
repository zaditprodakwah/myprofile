import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CommandPalette from "@/components/CommandPalette";
import MobileQuickNav from "@/components/MobileQuickNav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://muhzadit.vercel.app";

export const metadata: Metadata = {
  title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect",
  description: "Portofolio & Growth Engine Muhammad Khoiruzzadittaqwa (Zadit) - Full-Stack Growth Architect. Spesialis SEO teknikal, copywriting konversi, dan rekayasa web terukur.",
  keywords: ["Zadit", "Muhzadit", "Muhammad Khoiruzzadittaqwa", "Full-Stack Growth Architect", "SEO Teknikal", "Copywriting", "AEO", "GEO", "Next.js Developer Indonesia"],
  authors: [{ name: "Muhammad Khoiruzzadittaqwa", url: SITE_URL }],
  creator: "Muhammad Khoiruzzadittaqwa",
  publisher: "NaikDigital",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      'id-ID': '/',
      'en-US': '/',
      'x-default': '/'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect",
    description: "Portofolio & Growth Engine Muhammad Khoiruzzadittaqwa (Zadit) - Full-Stack Growth Architect. Spesialis SEO teknikal, copywriting konversi, dan rekayasa web terukur.",
    url: SITE_URL,
    siteName: "Zadit Growth Portfolio",
    images: [
      {
        url: `${SITE_URL}/background.png`,
        width: 1200,
        height: 630,
        alt: "Muhammad Khoiruzzadittaqwa - Full-Stack Growth Architect",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect",
    description: "Portofolio & Growth Engine Muhammad Khoiruzzadittaqwa (Zadit) - Full-Stack Growth Architect.",
    creator: "@muhzadit",
    images: [`${SITE_URL}/background.png`],
  },
  verification: {
    google: "BJYm8JSKI4BDrYrkwuPrIEynUPXylZ52ziWOE7DrGDY",
    other: {
      "msvalidate.01": "015756E98C3F3893642C5EC255A85850"
    }
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
    "url": SITE_URL,
    "image": `${SITE_URL}/api/og?type=home`,
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
      "https://www.instagram.com/muhzadit",
      "https://wa.me/6282316363177",
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Zadit Growth Portfolio",
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/blog?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
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
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-alabaster text-text-primary font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CommandPalette />
        <MobileQuickNav />
      </body>
    </html>
  );
}



