import Edit from "@/app/_components/EditComponents/edit";
import { Toaster } from "react-hot-toast";
import { Providers } from "../_provide/providers";
export default async function Home() {
  return (
    <section className="h-[100dvh] overflow-hidden">
      <Providers>
        <Edit />
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
