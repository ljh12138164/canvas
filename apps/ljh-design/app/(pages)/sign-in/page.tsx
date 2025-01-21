import SignIn from '@/app/_components/Sign/SignIn';
export default async function SignInPage() {
  return (
    <section>
      <main className="w-full h-[100dvh] flex items-center justify-center">
        <div className="w-full h-full md:h-auto md:w-[420px]">
          <SignIn />
        </div>
      </main>
    </section>
  );
}
