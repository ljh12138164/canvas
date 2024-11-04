import { Providers } from "@/app/_provide/providers";

import Board from "@/components/Board/Board";
import { jwtDecode } from "@/lib/sign";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = (await cookies()).get("token")?.value;
  const userId = await jwtDecode(cookieStore);
  if (!userId) redirect("/board/sign-in");
  return (
    <Providers>
      <Board userId={userId?.userid}></Board>
    </Providers>
  );
}
