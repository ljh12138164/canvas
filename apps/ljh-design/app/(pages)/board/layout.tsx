import { Providers } from "@/app/_provide/providers";
import type { Metadata } from "next";
import { inter, myFont } from "@/lib/font";
export const metadata: Metadata = {
  title: "LJH Design ",
  description: "LJH Design ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body>
        <Providers>
          <main className={`${inter.className} ${myFont.variable}`}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
