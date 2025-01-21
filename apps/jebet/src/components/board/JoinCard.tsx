import { useIsMobile } from '@/hooks/use-mobile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { z } from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/InputOtp';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawerui';
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
  width: 4rem;
  height: 4rem;
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
  }
`;
const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;
const zodSchema = z.object({
  code: z.string().min(6, {
    message: '邀请码长度为6位',
  }),
});

export default function JoinCard() {
  const { handleSubmit, reset, formState, setValue } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      code: '',
    },
  });
  const navigate = useNavigate();
  const isModile = useIsMobile();
  const [open, setOpen] = useState(false);
  const onSubmit = handleSubmit((data) => {
    navigate(`/dashboard/join/${data.code}`);
  });
  if (isModile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <Button>加入工作区</Button>
        </DrawerTrigger>
        <DrawerContent>
          <form onSubmit={onSubmit}>
            <DrawerHeader>
              <DrawerTitle>加入工作区</DrawerTitle>
              <DrawerDescription>请输入邀请码加入工作区</DrawerDescription>
            </DrawerHeader>
            <InputOTPGroups
              onChange={(e) => {
                setValue('code', e);
              }}
              placeholder="请输入邀请码"
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
            {formState.errors.code && <ErrorMessage>{formState.errors.code.message}</ErrorMessage>}
            <DrawerFooter>
              <DrawerClose asChild>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
              </DrawerClose>
              <Button type="submit">加入工作区</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>加入工作区</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>加入工作区</DialogTitle>
            <DialogDescription>请输入邀请码加入工作区</DialogDescription>
          </DialogHeader>
          <InputOTPGroups
            onChange={(e) => {
              setValue('code', e);
            }}
            placeholder="请输入邀请码"
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
          {formState.errors.code && <ErrorMessage>{formState.errors.code.message}</ErrorMessage>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              取消
            </Button>
            <Button type="submit">加入工作区</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
