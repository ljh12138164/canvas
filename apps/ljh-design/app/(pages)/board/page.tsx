import Board from '@/components/Board/Board';

import { inter, myFont } from '@/lib/font';
import { Toaster } from 'react-hot-toast';

export default async function Home() {
  return (
    <main className={`${inter.className} ${myFont.variable} min-w-[380px]`}>
      <Board></Board>
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
    </main>
  );
}
