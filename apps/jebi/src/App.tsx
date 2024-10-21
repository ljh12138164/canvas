import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
function App() {
  return (
    <>
      <QueryClientProvider client={queryclinet}>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        <ErrorBoundary fallback={<div>Error</div>}>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: { duration: 3000 },
              error: { duration: 5500 },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "white",
                zIndex: 10,
              },
            }}
          ></Toaster>
        </ErrorBoundary>
      </QueryClientProvider>
    </>
  );
}

export default App;
