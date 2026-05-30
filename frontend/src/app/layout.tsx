import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Safal-AI | Your AI Financial Assistant",
  description: "AI-powered expense management, receipt tracking, warranty reminders, and financial insights",
  keywords: ["AI", "expense management", "financial assistant", "receipt tracking", "warranty"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
