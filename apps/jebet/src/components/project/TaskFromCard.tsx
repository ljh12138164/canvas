import { useIsMobile } from '@/hooks/use-mobile';
import type { Member, Task } from '@/types/workspace';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawerui';
import TaskFrom from './TaskFrom';

const TaskFromCard = ({
  children,
  type,
  workspaceId,
  projectId,
  userData,
  currentUserId,
  defaultData,
}: {
  children: React.ReactNode;
  type: 'create' | 'edit';
  workspaceId: string;
  projectId: string;
  userData: Member[] | undefined;
  currentUserId: string;
  defaultData?: Task;
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger className={`${type === 'edit' && 'w-full'} cursor-pointer`}>{children}</DrawerTrigger>
        <DrawerContent className="py-4">
          <DrawerHeader>
            <DrawerTitle>{type === 'create' ? '添加任务' : '编辑任务'}</DrawerTitle>
          </DrawerHeader>
          <TaskFrom workspaceId={workspaceId} projectId={projectId} isMobile={isMobile} type={type} userData={userData} currentUserId={currentUserId} defaultData={defaultData} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${type === 'edit' && 'w-full'} cursor-pointer`} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="py-4">
        <DialogHeader>
          <DialogTitle>{type === 'create' ? '添加任务' : '编辑任务'}</DialogTitle>
        </DialogHeader>
        <TaskFrom workspaceId={workspaceId} projectId={projectId} type={type} userData={userData} isMobile={isMobile} currentUserId={currentUserId} defaultData={defaultData} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFromCard;
