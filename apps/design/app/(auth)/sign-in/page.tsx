import SignIn from "@/app/_components/Sign/SignIn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <main className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full md:h-auto md:w-[420px]">
        <SignIn />
      </div>
    </main>
  );
}
