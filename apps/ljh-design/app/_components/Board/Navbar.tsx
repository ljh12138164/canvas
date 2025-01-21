'use client';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/_components/ui/sheet';
import { useIsMobile } from '@/app/_hook/use-mobile';
import { MenuIcon } from 'lucide-react';
import { useRef } from 'react';
import Logo from '../Comand/Logo';
import { ThemeToggle } from '../Comand/ThemeToggle';
import UserButton from '../Comand/UserButton';
import { Button } from '../ui/button';
import SiderBar from './SiderBar';

const NavBar = () => {
  const isMobile = useIsMobile();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  return (
    <nav className="bg-muted flex p-4 items-center h-[60px] w-full">
      {!isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-muted w-[300px]">
            <SheetHeader>
              <SheetTitle>
                <div className="m-2 flex items-center gap-x-4">
                  <Logo to="/" />
                  <span className="text-xl font-semibold text-primary">ljh-design</span>
                </div>
              </SheetTitle>
              <SheetClose ref={closeRef} />
            </SheetHeader>
            <SiderBar hide={!isMobile} closeRef={closeRef} />
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
