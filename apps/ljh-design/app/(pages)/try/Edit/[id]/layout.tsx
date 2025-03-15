import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: '画布试用',
  description: 'LJH Design 画布试用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
