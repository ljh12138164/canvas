import UserData from '@/app/_components/Board/UserData';
export default async function Home() {
  return (
    <main className="min-w-[380px] w-full h-full entry">
      <UserData />
    </main>
  );
}
