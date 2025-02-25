import { useAddFrident } from '@/app/_hook/query/useFrident';
import { useUser } from '@/app/_store/auth';
import type { Profiles } from '@/app/_types/user';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';
import AvatarImage from '../Comand/AvatarImage';
import { Response } from '../Comand/Response';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
const FirdentAplly = ({ item }: { item: Profiles }) => {
  const { addFridentMutate } = useAddFrident();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const applyRef = useRef<{
    closeModel: () => void;
  }>(null);
  return (
    <>
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AvatarImage src={item.image} alt={item.name} priority width={30} height={30} />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
        <Response
          title="同意申请"
          showDescription
          description={`同意${item.name}的好友申请`}
          myTrigger={<Button variant="outline">同意</Button>}
          ref={applyRef}
          onConfirm={() => {
            toast.loading('同意好友申请中...');
            addFridentMutate(
              { json: { id: item.id, adduser: user!.user.id } },
              {
                onSuccess: () => {
                  toast.dismiss();
                  applyRef.current?.closeModel();
                  queryClient.invalidateQueries({ queryKey: ['frident'] });
                  toast.success('添加好友成功');
                },
              },
            );
          }}
        />
      </section>
      <Separator className="my-2" />
    </>
  );
};

export default FirdentAplly;
