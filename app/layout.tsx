import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PULSE | Smart Market Watchlist & Delta Intelligence",
  description: "Next-generation market watchlist platform that surfaces what has meaningfully changed since you last checked.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
