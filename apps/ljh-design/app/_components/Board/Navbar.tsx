'use client';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/_components/ui/sheet';
import { useMediaQuery } from '@/app/_hook/useMediaQuery';
import { MenuIcon } from 'lucide-react';
import { useRef } from 'react';
import Logo from '../Comand/Logo';
import { ThemeToggle } from '../Comand/ThemeToggle';
import UserButton from '../Comand/UserButton';
import { Button } from '../ui/button';
import SiderBar from './SiderBar';

const NavBar = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const closeRef = useRef<HTMLButtonElement | null>(null);

  return (
    <nav className="bg-muted flex p-4 items-center h-[60px] w-full">
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" aria-label="打开侧边栏">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-muted w-[300px]">
            <SheetHeader className="flex ">
              <SheetTitle>
                <div className="m-2 flex items-center gap-x-4">
                  <Logo to="/" />
                  <span className="text-xl font-semibold text-primary">ljh-design</span>
                </div>
              </SheetTitle>
              <SheetDescription asChild>
                <span className="text-sm text-muted-foreground hidden">侧边栏</span>
              </SheetDescription>
            </SheetHeader>
            <section>
              <SheetClose ref={closeRef} />
              <SiderBar hide={isMobile} closeRef={closeRef} />
            </section>
          </SheetContent>
        </Sheet>
      )}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
