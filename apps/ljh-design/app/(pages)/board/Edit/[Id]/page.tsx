import { Toaster } from 'react-hot-toast';
import { Providers } from '@/app/_provide/providers';
import Edit from '@/components/EditComponents/Edit';
import { cookies } from 'next/headers';
import { jwtDecode } from '@/lib/sign';
import { redirect } from 'next/navigation';
import { inter, myFont } from '@/lib/font';

type Params = Promise<{
  Id: string;
}>;
export default async function Home({ params }: { params: Params }) {
  const { Id } = await params;
  const cookieStore = (await cookies()).get('token')?.value;
  const userId = await jwtDecode(cookieStore);
  if (!userId) redirect('/board/sign-in');
  return (
    <section
      className={`${inter.className} ${myFont.variable} h-[100dvh] overflow-hidden`}
    >
      <Providers>
        <Edit params={Id} userId={userId?.userid} />
      </Providers>
      <Toaster
        position='top-center'
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: { duration: 2000 },
          error: { duration: 5500 },
          loading: { duration: 10000 },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: 'white',
            zIndex: 10,
          },
        }}
      />
    </section>
  );
}
