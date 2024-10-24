import SignIn from "@/app/_components/Sign/SignIn";

export default async function SignInPage() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full md:h-auto md:w-[420px]">
        <SignIn />
      </div>
    </main>
  );
}
