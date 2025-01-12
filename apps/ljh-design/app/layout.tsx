import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "LJH-DESIGN",
  description: "LJH-DESIGN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
