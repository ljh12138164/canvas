import FormueMain from '@/app/_components/Formue/FormueMain';
import { inter, myFont } from '@/app/_lib/font';
import { Providers } from '@/app/_provide/providers';

export default async function Home() {
  return (
    <div className={`${inter.className} ${myFont.variable}  entry`}>
      <Providers>
        <FormueMain />
      </Providers>
    </div>
  );
}
