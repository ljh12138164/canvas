import type { Metadata } from "next";
import { Providers } from "@/app/_provide/providers";
export const metadata: Metadata = {
  title: "登录",
  description: "登录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
