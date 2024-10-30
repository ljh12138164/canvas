import { Providers } from "@/app/_provide/providers";
import SiderBar from "../_components/Board/SiderBar";
import NavBar from "../_components/Board/Navbar";
import BoardMain from "../_components/Board/BoardMain";

export default async function Home() {
  return (
    <Providers>
      <div className="bg-muted h-full">
        <SiderBar />
        <div className="lg:pl-[300px] flex flex-col h-full">
          <NavBar />
          <main className="px-2 py-4 bg-white">
            <BoardMain></BoardMain>
          </main>
        </div>
      </div>
    </Providers>
  );
}