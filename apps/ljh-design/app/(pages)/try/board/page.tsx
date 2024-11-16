import TryBoard from "@/components/Try/TryBoard";
import { myFont, inter } from "@/lib/font";
export default async function Home() {
  return (
    <div className={`${inter.className} ${myFont.variable} h-full w-full`}>
      <TryBoard></TryBoard>
    </div>
  );
}
