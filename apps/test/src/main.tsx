import { reactQueryConfig } from '@ljh/lib';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import './app.css';
import { router } from './router';

const queryclinet = new QueryClient(reactQueryConfig);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <ErrorBoundary fallback={<>cw</>}>
      <QueryClientProvider client={queryclinet}>
        {/* <ReactFlowProvider> */}
        <ReactQueryDevtools />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
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
        {/* <ShaducnToast /> */}
        {/* </ReactFlowProvider> */}
      </QueryClientProvider>
    </ErrorBoundary>
    ,
  </StrictMode>,
);
