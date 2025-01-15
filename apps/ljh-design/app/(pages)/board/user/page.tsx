import UserData from '@/app/_components/Board/UserData';
import { inter, myFont } from '@/app/_lib/font';
export default async function Home() {
  return (
    <main
      className={`${inter.className} ${myFont.variable} min-w-[380px] w-full h-full entry`}
    >
      <UserData />
    </main>
  );
}
