import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://f1-test-nine.vercel.app'),
  title: "NeuroDrive - F1 Cognitive Performance",
  description: "Train your cognitive reflexes like an F1 Champion. Reaction. Speed. Precision.",
  openGraph: {
    title: "NeuroDrive - F1 Cognitive Performance",
    description: "Train your cognitive reflexes like an F1 Champion. Reaction. Speed. Precision.",
    url: 'https://f1-test-nine.vercel.app',
    siteName: 'NeuroDrive',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NeuroDrive - F1 Cognitive Performance",
    description: "Train your cognitive reflexes like an F1 Champion. Reaction. Speed. Precision.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          orbitron.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
