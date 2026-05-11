import { Metadata } from "next";

export function getBaseMetadata(title: string, description: string, path: string): Metadata {
  const baseUrl = "https://zadit.pro";
  const url = `${baseUrl}${path}`;

  return {
    title: `${title} | Zadit Intelligence Hub`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Zadit Intelligence Hub",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@zadit",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
