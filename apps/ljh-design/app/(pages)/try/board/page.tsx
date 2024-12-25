import TryBoard from '@/components/Try/TryBoard';
import { inter, myFont } from '@/lib/font';

export default function TryBoardPage() {
  return (
    <div className={`${inter.className} ${myFont.variable} h-full w-full`}>
      <TryBoard />
    </div>
  );
}
