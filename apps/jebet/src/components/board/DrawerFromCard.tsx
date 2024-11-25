import { useIsMobile } from '@/hooks/use-mobile';
import userStore from '@/store/user';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent } from '../ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../ui/drawerui';
import FromCard from './FromCard';
const DrawerFromCard = observer(
  ({ type }: { type: 'workspace' | 'project' }) => {
    const isDesktop = useIsMobile();
    const [open, setOpen] = React.useState(false);
    const drawref = useRef<HTMLButtonElement | null>(null);
    const dialogref = useRef<HTMLButtonElement | null>(null);
    const { userData } = userStore;

    if (!userData) return null;
    if (!isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <IoIosAddCircleOutline
              size={20}
              className='cursor-pointer text-black/40 hover:text-black hover:bg-slate-100 transition-all duration-200'
            />
          </DialogTrigger>
          <DialogClose asChild>
            <Button variant='outline' className='hidden' ref={dialogref}>
              取消
            </Button>
          </DialogClose>
          <DialogContent>
            <FromCard
              type='create'
              formType={type}
              userData={userData}
              closeRef={dialogref}
            ></FromCard>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <IoIosAddCircleOutline
            size={20}
            className='cursor-pointer text-black/40 hover:text-black hover:bg-slate-100 transition-all duration-200'
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerClose asChild>
            <button className='hidden' ref={drawref}></button>
          </DrawerClose>
          <FromCard
            type='create'
            formType={type}
            userData={userData}
            closeRef={drawref}
          ></FromCard>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default DrawerFromCard;
