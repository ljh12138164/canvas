// import { Toaster as ShaducnToast } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { ReactFlowProvider } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import 'quill/dist/quill.core.css';

import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import 'react-photo-view/dist/react-photo-view.css';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import './index.css';
import Index from './page/error/Index';
import { router } from './router';

const queryclinet = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5,
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchInterval: 60 * 1000 * 5,
      refetchIntervalInBackground: true,
    },
  },
});

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <ErrorBoundary fallback={<Index />}>
    <QueryClientProvider client={queryclinet}>
      {/* <ReactFlowProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
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
  </ErrorBoundary>,
);
