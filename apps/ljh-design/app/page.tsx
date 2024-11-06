import Link from "next/link";
import { Providers } from "@/app/_provide/providers";
import { inter, myFont } from "@/lib/font";
export default async function Home() {
  return (
    <Providers>
      <div
        className={`${inter.className} ${myFont.variable} h-[100dvh] flex items-center justify-center`}
      >
        <Link href={"/board/Edit"}>成功登录</Link>
      </div>
    </Providers>
  );
}
