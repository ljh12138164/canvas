import { inter, myFont } from '@/app/_lib/font';
import { Providers } from '@/app/_provide/providers';

export default async function Home() {
  return (
    <div className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden entry`}>
      <Providers>
        <div>222</div>
      </Providers>
    </div>
  );
}
