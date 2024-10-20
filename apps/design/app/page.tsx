import Link from "next/link";
import { protectServer } from "@/lib/utils";

export default async function Home() {
  await protectServer();
  return (
    <div className="h-[100dvh] flex items-center justify-center">
      <Link href={"/Edit"}>成功登录</Link>
    </div>
  );
}
