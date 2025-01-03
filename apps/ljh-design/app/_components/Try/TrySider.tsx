'use client';
import { Home, User } from 'lucide-react';
import SiderBarItem from '../Board/SiderBarItem';
import Logo from '../Comand/Logo';
import { Separator } from '../ui/separator';
import { usePathname } from 'next/navigation';

const TrySider = () => {
  const pathName = usePathname();
  return (
    <aside className='hidden bg-slate-50/15 border-r-[2px] transition-all duration-300 lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full'>
      <div className='m-2 flex items-center gap-x-4'>
        <Logo to='/' />
        <span className='text-xl font-semibold text-primary'>
          {/* TODO: logo */}
          ljh-design
        </span>
      </div>
      <Separator className='my-2' />
      <ul className='flex flex-col h-full w-full justify-between pb-2'>
        <li className='p-4'>
          <SiderBarItem
            href='/try/board'
            label='主页'
            Icon={Home}
            isActive={pathName === '/try/board'}
          />
        </li>
        <li className='p-4'>
          <Separator className='mb-2' />
          <SiderBarItem
            href='/try/board/userData'
            label='个人中心'
            Icon={User}
            isActive={pathName === '/try/board/userData'}
          />
        </li>
      </ul>
    </aside>
  );
};

export default TrySider;
