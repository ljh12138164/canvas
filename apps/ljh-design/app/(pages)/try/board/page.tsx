import TryBoard from '@/app/_components/Try/TryBoard';
import { inter, myFont } from '@/app/_lib/font';

export default function TryBoardPage() {
  return (
    <div className={`${inter.className} ${myFont.variable} h-full w-full`}>
      <TryBoard />
    </div>
  );
}
