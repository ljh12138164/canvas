import type { Metadata } from "next";
import { Providers } from "@/app/_provide/providers";
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
