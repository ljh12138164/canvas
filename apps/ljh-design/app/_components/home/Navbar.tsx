'use client';
import { ThemeToggle } from '@/app/_components/Comand/ThemeToggle';
import UserButton from '@/app/_components/Comand/UserButton';
import { Button } from '@/app/_components/ui/button';
import useUsers from '@/app/_hook/useUser';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
const NavBar = () => {
  const { loading, user } = useUsers({ redirects: false });
  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xs border-b ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-2xl font-bold">ljh-design</div>
        <div className="space-x-4 flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <Skeleton className="w-10 rounded-full h-10" />
          ) : (
            <>
              {user ? (
                <UserButton />
              ) : (
                <Link href="/sign-in">
                  <Button variant="ghost">登录</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
