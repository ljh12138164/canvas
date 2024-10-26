import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
const queryclinet = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello</div>,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryclinet}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ErrorBoundary fallback={<div>Error</div>}>
        <RouterProvider
          router={router}
          fallbackElement={<div>Loading...</div>}
        />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
