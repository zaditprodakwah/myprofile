import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/hooks/use-mode";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { JSONLD } from "@/components/seo/JSONLD";
import { PageTransition } from "@/components/animations/PageTransition";
import { MouseFollower } from "@/components/animations/MouseFollower";
import { AppSidebar } from "@/components/layout/AppSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={cn(inter.variable, outfit.variable, "font-sans antialiased text-slate-100")}>
        <JSONLD />
        <MouseFollower />
        <AppSidebar />
        <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
          <ModeProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </ModeProvider>
        </Suspense>
      </body>
    </html>
  );
}
