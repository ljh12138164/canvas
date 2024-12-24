'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useUser from '@/hook/useUser';
import { logout } from '@/server/user';
import { User } from 'lucide-react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { LuLogOut } from 'react-icons/lu';
import { Skeleton } from '../ui/skeleton';

const UserButton = () => {
  const { user, loading } = useUser();

  return (
    <>
      {loading ? (
        <Skeleton className='size-10 rounded-full'></Skeleton>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar className='size-10 hover:opacity-80 transition-all duration-300 '>
              <AvatarImage
                alt='用户头像'
                src={user?.user.user_metadata.image}
              />
              <AvatarFallback>{user?.user.user_metadata.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-60'>
            <DropdownMenuItem
              className='h-10 cursor-pointer'
              onClick={() => {}}
            >
              <User className='size-4 mr-2 ' />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem
              className='h-10 cursor-pointer'
              onClick={async () => {
                await logout();
                toast.success('登出成功');
                redirect('/board/sign-in');
              }}
            >
              <LuLogOut className='size-4 mr-2 ' />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserButton;
