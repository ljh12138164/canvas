import { Providers } from "@/app/_provide/providers";
import NavBar from "@/components/Board/Navbar";
import SiderBar from "@/components/Board/SiderBar";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "LJH Design ",
  description: "LJH Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <body>
        <Providers>
          <div className="bg-muted h-[100vh] ">
            <SiderBar />
            <div className="lg:pl-[300px] flex flex-col h-full">
              <NavBar />
              <main
                className="px-2 py-4 bg-white flex-1 min-w-[380px] overflow-hidden"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                {children}
              </main>
            </div>
          </div>
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
          />
        </Providers>
      </body>
    </html>
  );
}
