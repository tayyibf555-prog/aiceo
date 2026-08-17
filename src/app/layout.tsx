import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Over 8 live sessions we build systems you own outright: a second brain, a speed to lead agent, a reactivation agent, and an AI CEO orchestrator that runs them all. You own every file.";

export const metadata: Metadata = {
  title: "The AI CEO · Run your business like an AI CEO",
  description,
  openGraph: {
    title: "The AI CEO",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI CEO",
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1D6BFF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-ink">{children}</body>
    </html>
  );
}
