import BoardMain from "@/components/Board/BoardMain";
import { inter, myFont } from "@/lib/font";

export default async function Home() {
  return (
    <main className={`${inter.className} ${myFont.variable} min-w-[380px]`}>
      <BoardMain></BoardMain>
    </main>
  );
}
