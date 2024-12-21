import { Member, Workspace } from '@/types/workspace';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
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
        <Button className='mt-4'>
          <PlusIcon className='w-4 h-4' />
          <span>创建文件</span>
        </Button>
      </DialogTrigger>
      <DialogContent className=' h-[80dvh]'>
        <DialogHeader>
          <DialogTitle>创建文件</DialogTitle>
        </DialogHeader>
        <Form userId={userId} workspace={workspace} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateStorage;
