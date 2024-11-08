import { Providers } from '@/app/_provide/providers';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'LJH Design ',
  description: 'LJH Design',
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
