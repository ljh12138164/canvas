import Board from "@/app/_components/Board/Board";
import { inter, myFont } from "@/app/_lib/font";

export default async function Home() {
  return (
    <main className={`${inter.className} ${myFont.variable} min-w-[380px]`}>
      <Board></Board>
    </main>
  );
}
