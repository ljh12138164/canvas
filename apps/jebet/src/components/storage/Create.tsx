import type { Member, Workspace } from '@/types/workspace';
import { PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import Form from './Form';

interface CreateStorageProps {
  userId: string;
  workspace: Workspace & {
    member: Member[];
  };
}
const CreateStorage = ({ userId, workspace }: CreateStorageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">
          <PlusIcon className="w-4 h-4" />
          <span>创建文件</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[45dvh]">
        <Form userId={userId} workspace={workspace} type="create" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateStorage;
