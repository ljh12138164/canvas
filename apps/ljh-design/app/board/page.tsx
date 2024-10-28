import Link from "next/link";
import { Providers } from "@/app/_provide/providers";

export default async function Home() {
  return (
    <Providers>
      <div className="h-[100dvh] flex items-center justify-center">
        <Link href={"/Edit"}>成功登录</Link>
      </div>
    </Providers>
  );
}
