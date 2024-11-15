import TryBoard from "@/components/Try/TryBoard";
import { myFont, inter } from "@/lib/font";
export default async function Home() {
  return (
    <div className={`${inter.className} ${myFont.variable} h-[100dvh] w-full`}>
      <TryBoard></TryBoard>
    </div>
  );
}
