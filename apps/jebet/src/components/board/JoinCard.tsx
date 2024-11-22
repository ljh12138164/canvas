import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/InputOtp';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerClose,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '../ui/drawerui';
import styled from 'styled-components';
const InputOTPGroups = styled(InputOTP)`
  display: flex;
  width: 100%;
  justify-content: center;
`;
const InputContainer = styled(InputOTPGroup)`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 2rem 0;
`;
const InputItems = styled(InputOTPSlot)`
  width: 2rem;
  height: 2rem;
`;
export default function JoinCard() {
  const [input, setInput] = useState('');
  const isModile = useIsMobile();
  const [open, setOpen] = useState(false);
  if (isModile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <Button>加入工作区</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>加入工作区</DrawerTitle>
            <DrawerDescription>请输入邀请码加入工作区</DrawerDescription>
          </DrawerHeader>
          <InputOTPGroups
            value={input}
            onChange={(e) => {
              setInput(e);
            }}
            placeholder='请输入邀请码'
            maxLength={6}
          >
            <InputContainer>
              <InputItems index={0} />
              <InputItems index={1} />
              <InputItems index={2} />
              <InputItems index={3} />
              <InputItems index={4} />
              <InputItems index={5} />
            </InputContainer>
          </InputOTPGroups>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant='outline' onClick={() => setOpen(false)}>
                取消
              </Button>
            </DrawerClose>
            <Button>加入工作区</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>加入工作区</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>加入工作区</DialogTitle>
          <DialogDescription>请输入邀请码加入工作区</DialogDescription>
        </DialogHeader>
        <InputOTPGroups
          value={input}
          onChange={(e) => {
            setInput(e);
          }}
          placeholder='请输入邀请码'
          maxLength={6}
        >
          <InputContainer>
            <InputItems index={0} />
            <InputItems index={1} />
            <InputItems index={2} />
            <InputItems index={3} />
            <InputItems index={4} />
            <InputItems index={5} />
          </InputContainer>
        </InputOTPGroups>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button>加入工作区</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
