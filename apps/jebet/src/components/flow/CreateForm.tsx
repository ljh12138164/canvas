import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { Member, Workspace } from '@/types/workspace';
import { PlusIcon } from '@radix-ui/react-icons';
import Form from './Form';

export const CreateForm = ({
  workspace,
  workspaceId,
}: {
  workspace: Workspace & {
    member: Member[];
  };
  workspaceId: string;
}) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <PlusIcon className="w-4 h-4" />
            <span>创建工作流</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[45dvh]">
          <Form workspace={workspace} workspaceId={workspaceId} type="create" />
        </DialogContent>
      </Dialog>
    </div>
  );
};
