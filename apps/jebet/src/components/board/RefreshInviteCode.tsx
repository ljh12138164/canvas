import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRefreshWorkspace } from '@/server/hooks/board';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCopyOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/InputOtp';

const CopyButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
`;
const CopyIcon = styled(IoCopyOutline)`
  border-radius: 0.25rem;
  border: 1.2px solid rgba(0, 0, 0, 0.05);
  padding: 0.4rem;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
const InputItems = styled(InputOTPSlot)`
  width: 5rem;
  height: 4rem;
`;

export default function RefreshInviteCode({
  canEdit,
  workspaceId,
  inviteCode,
  userId,
}: {
  canEdit: boolean;
  workspaceId: string;
  userId: string;
  inviteCode: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { refreshWorkspace, isRefreshing } = useRefreshWorkspace();
  const [newInviteCode, setNewInviteCode] = useState(inviteCode);
  function handleRefresh() {
    refreshWorkspace(
      { json: { id: workspaceId, userId } },
      {
        onSuccess: (data) => {
          toast.success('刷新成功');
          closeRef.current?.click();
          setNewInviteCode(data.inviteCode);
        },
      },
    );
  }
  function handleCopy() {
    navigator.clipboard.writeText(newInviteCode);
    toast.dismiss();
    toast.success('复制成功');
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>邀请码</CardTitle>
      </CardHeader>
      <CardContent>
        <CopyButton>
          <InputOTP value={newInviteCode} maxLength={6}>
            <InputOTPGroup>
              <InputItems index={0} />
              <InputItems index={1} />
              <InputItems index={2} />
              <InputItems index={3} />
              <InputItems index={4} />
              <InputItems index={5} />
            </InputOTPGroup>
          </InputOTP>
          <CopyIcon data-clipboard-target="#inviteCode" onClick={handleCopy} />
        </CopyButton>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!canEdit} variant="outline">
              刷新邀请码
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>刷新邀请码</DialogTitle>
              <DialogDescription>刷新邀请码将重新生成邀请码</DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" ref={closeRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleRefresh}
                  disabled={!canEdit || isRefreshing}
                >
                  {isRefreshing ? '刷新中...' : '刷新邀请码'}
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
