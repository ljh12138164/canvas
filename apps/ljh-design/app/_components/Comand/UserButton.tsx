'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { logout } from '@/app/_database/user';
import useUsers from '@/app/_hook/useUser';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LuLogOut } from 'react-icons/lu';
import { Skeleton } from '../ui/skeleton';
import AvatarImage from './AvatarImage';

const UserButton = () => {
  const { user, loading } = useUsers({ redirects: false });
  const router = useRouter();

  return (
    <>
      {loading ? (
        <Skeleton className="size-10 rounded-full" />
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <AvatarImage
              className="size-10 hover:opacity-80 transition-all duration-300 cursor-pointer"
              src={user?.user.user_metadata.image || ''}
              alt="用户头像"
              width={30}
              height={30}
              priority
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem
              className="h-10 cursor-pointer"
              onClick={() => {
                router.push('/board/user');
              }}
            >
              <User className="size-4 mr-2 " />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem
              className="h-10 cursor-pointer"
              onClick={async () => {
                await logout();
                toast.success('登出成功');
                return router.push('/sign-in');
              }}
            >
              <LuLogOut className="size-4 mr-2 " />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserButton;
