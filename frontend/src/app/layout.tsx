import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SAFAL-AI | Single AI Platform for Everything",
  description:
    "SAFAL-AI is a single AI platform to connect AI models, integrate applications, upload files, and complete tasks through simple prompts. Works with SafalVir products, ChatGPT, Claude, Gemini, and custom LLMs.",
  keywords: [
    "SAFAL-AI",
    "AI automation platform",
    "AI model integration",
    "prompt-based automation",
    "AI workflow platform",
    "connect AI models",
    "Safal Tokens",
    "SafalVir AI",
    "ChatGPT integration",
    "Claude integration",
    "Gemini integration",
    "bring your own API key",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
