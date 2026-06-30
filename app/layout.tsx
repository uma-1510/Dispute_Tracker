import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR Dispute Resolution — Disputes",
  description: "AI-assisted accounts receivable dispute resolution tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
