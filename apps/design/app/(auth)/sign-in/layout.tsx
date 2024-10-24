import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "编辑器",
  description: "编辑器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn" className="scroll">
      <body>
        <section className="h-[100dvh] overflow-hidden">
          {children}
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: { duration: 2000 },
              error: { duration: 5500 },
              loading: { duration: 10000 },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "white",
                zIndex: 10,
              },
            }}
          ></Toaster>
        </section>
      </body>
    </html>
  );
}