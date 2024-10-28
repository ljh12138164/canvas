import { Providers } from "@/app/_provide/providers";
import SiderBar from "../_components/Board/SiderBar";
import NavBar from "../_components/Board/Navbar";

export default async function Home() {
  return (
    <Providers>
      <div className="bg-muted h-full">
        <SiderBar />
        <div className="lg:pl-[300px] flex flex-col h-full">
          <NavBar />
        </div>
      </div>
    </Providers>
  );
}
