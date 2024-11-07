import Board from "@/components/Board/Board";
import { jwtDecode } from "@/lib/sign";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { inter, myFont } from "@/lib/font";
export default async function Home() {
  const cookieStore = (await cookies()).get("token")?.value;
  const userId = await jwtDecode(cookieStore);
  if (!userId) redirect("/board/sign-in");
  return (
    <main className={`${inter.className} ${myFont.variable} min-w-[380px]`}>
      <Board userId={userId?.userid}></Board>;
    </main>
  );
}
