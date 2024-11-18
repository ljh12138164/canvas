import TryMain from '@/components/Try/TryMain';
import { myFont, inter } from '@/lib/font';
export default async function Home() {
  return (
    <div className={`${inter.className} ${myFont.variable} h-full w-full`}>
      <TryMain></TryMain>
    </div>
  );
}
