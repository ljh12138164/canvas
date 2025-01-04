import { Providers } from "@/app/_provide/providers";
import EditMain from "@/app/_components/EditComponents/EditMain";
import { inter, myFont } from "@/app/_lib/font";
import { Toaster } from "react-hot-toast";

type Params = Promise<{
  Id: string;
}>;
export default async function Home({ params }: { params: Params }) {
  const { Id } = await params;
  return (
    <section
      className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden`}
    >
      <Providers>
        <EditMain id={Id} />
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
      />
    </section>
  );
}
