import { Providers } from "@/app/_provide/providers";
import { inter, myFont } from "@/app/_lib/font";
import Link from "next/link";

export default async function Home() {
  return (
    <div
      className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden`}
    >
      <Providers>
        <div>
          <Link href="/board/formue/create">创建分享模板</Link>
        </div>
      </Providers>
    </div>
  );
}
