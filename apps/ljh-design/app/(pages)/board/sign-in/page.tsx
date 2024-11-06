import SignIn from "@/components/Sign/SignIn";
import { Toaster } from "react-hot-toast";
import { inter, myFont } from "@/lib/font";
import { cookies } from "next/headers";
import { jwtDecode } from "@/lib/sign";
import { redirect } from "next/navigation";
export default async function SignInPage() {
  const cookieStore = (await cookies()).get("token")?.value;
  const userId = await jwtDecode(cookieStore);
  if (userId) redirect("/board");
  return (
    <section
      className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden`}
    >
      {/* @ts-ignore */}
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
      <main className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full md:h-auto md:w-[420px]">
          <SignIn />
        </div>
      </main>
    </section>
  );
}
