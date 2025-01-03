import { Providers } from "@/app/_provide/providers";
import Main from "./_components/home/Main";
import NavBar from "./_components/home/Navbar";
import { inter, myFont } from "@/app/_lib/font";

export default async function Home() {
  return (
    <Providers>
      <div className={`${inter.className} ${myFont.variable} min-h-[100dvh]`}>
        {/* 导航栏 */}
        <NavBar />

        {/* 主要内容区 */}
        <Main />
      </div>
    </Providers>
  );
}
