import SignIn from "@/app/_components/Sign/SignIn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return <SignIn />;
}
