import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Index from "./page/error/Index";

// eslint-disable-next-line react-refresh/only-export-components
const SignIn = lazy(() => import("./page/auth/SignIn"));

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
    element: <div>home</div>,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <Index />,
  },
]);
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <QueryClientProvider client={queryclinet}>
    <ReactQueryDevtools initialIsOpen={false} />
    <ErrorBoundary fallback={<Index />}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </ErrorBoundary>
  </QueryClientProvider>
);
