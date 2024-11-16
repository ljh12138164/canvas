import SignIn from '@/components/Sign/SignIn';
import { Toaster } from 'react-hot-toast';
export default async function SignInPage() {
  return (
    <section>
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
      <main className='w-full h-full flex items-center justify-center'>
        <div className='w-full h-full md:h-auto md:w-[420px]'>
          <SignIn />
        </div>
      </main>
    </section>
  );
}
