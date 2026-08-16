import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The AI CEO · Run your business like an AI CEO",
  description:
    "Over 8 live sessions we build systems you own outright: a second brain, a deputy that answers for you, speed to lead, reactivation, and a 7am brief. Your business runs on it. You own every file.",
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
