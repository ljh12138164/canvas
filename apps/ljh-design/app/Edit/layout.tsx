import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Providers } from "../_provide/providers";
export const metadata: Metadata = {
  title: "编辑器",
  description: "编辑器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body>{children}</body>
    </html>
  );
}
