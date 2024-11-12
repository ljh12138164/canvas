import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/_provide/providers";
import { inter, myFont } from "@/lib/font";
import TryEdit from "@/components/EditComponents/TryEdit";
export default async function Home() {
  return (
    <section
      className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden`}
    >
      <Providers>
        <TryEdit userId={undefined} />
      </Providers>
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
  );
}
