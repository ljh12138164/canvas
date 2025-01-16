import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Member, Workspace } from '@/types/workspace';
import { PlusIcon } from '@radix-ui/react-icons';
import Form from './Form';

export const CreateForm = ({
  workspace,
  workspaceId,
  userId,
}: {
  workspace: Workspace & {
    member: Member[];
  };
  workspaceId: string;
  userId: string;
}) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mt-4'>
            <PlusIcon className='w-4 h-4' />
            <span>创建工作流</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='h-[45dvh]'>
          <Form
            userId={userId}
            workspace={workspace}
            workspaceId={workspaceId}
            type='create'
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
