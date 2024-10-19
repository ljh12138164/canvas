import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div className="h-[100dvh] flex items-center justify-center">
      <Link href={"/Edit"}>{JSON.stringify(session)}</Link>
    </div>
  );
}
