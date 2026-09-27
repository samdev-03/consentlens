import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConsentLens — Keep meaning in consent",
  description: "Compare English and Spanish consent documents with their explanations. Review evidence-linked changes locally, with no account or API key.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
