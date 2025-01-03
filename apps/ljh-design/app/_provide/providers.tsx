"use client";
import QueryProvedie from "@/app/_provide/query-provide";
import { ThemeProvider } from "@/app/_components/Comand/ThemeProvide";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
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
    </QueryProvedie>
  );
};
