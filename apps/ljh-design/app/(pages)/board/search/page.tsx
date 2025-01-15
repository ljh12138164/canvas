import { Providers } from "@/app/_provide/providers";
import { inter, myFont } from "@/app/_lib/font";

export default async function Home() {
  return (
    <div
      className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden entry`}
    >
      <Providers>
      </Providers>
    </div>
  );
}
