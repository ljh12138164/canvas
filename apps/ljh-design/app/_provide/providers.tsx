'use client';
import { ThemeProvider } from '@/app/_components/Comand/ThemeProvide';
import QueryProvedie from '@/app/_provide/query-provide';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { myFont } from '../_lib/font';
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <div className={`${myFont.variable} h-[100dvh] overflow-hidden`}>
        <QueryProvedie>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster
            position="top-center"
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
        </QueryProvedie>
      </div>
    </Suspense>
  );
};
