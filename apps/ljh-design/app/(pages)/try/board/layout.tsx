import { Providers } from '@/app/_provide/providers';
import TrySider from '@/components/Try/TrySider';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  title: 'LJH Design try',
  description: 'LJH Design try',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='cn'>
      <body>
        <Providers>
          <div className='h-[100dvh] w-full overflow-hidden'>
            <div className='lg:pl-[300px] flex flex-col h-full'>
              {/* 头部 */}
              <div className='h-[60px] bg-slate-50'>
                <TrySider></TrySider>
              </div>
              <main
                className='px-2 py-4 bg-white flex-1 min-w-[380px] overflow-hidden'
                style={{
                  scrollbarWidth: 'none',
                }}
              >
                {children}
              </main>
            </div>
          </div>
          <Toaster
            position='top-center'
            gutter={12}
            containerStyle={{ margin: '8px' }}
            toastOptions={{
              success: { duration: 2000 },
              error: { duration: 5500 },
              loading: { duration: 10000 },
              style: {
                fontSize: '16px',
                maxWidth: '500px',
                padding: '16px 24px',
                backgroundColor: 'white',
                zIndex: 10,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
