'use client';
import { useMaterial } from '@/app/_hook/query/useMaterial';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Response } from '../Comand/Response';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
const MaterialMain = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { data, isLoading } = useMaterial();
  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <main className="min-w-[380px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">素材中心</h1>
          <Button variant="outline" onClick={() => router.push('/EditMaterial')}>
            <PlusCircle />
            添加素材
          </Button>
        </div>
        <h2 className="text-sm text-muted-foreground mb-4">
          素材是预设的一组组件，可以用于直接加入画布中开发。
        </h2>
      </main>
    </ScrollArea>
  );
};

export default MaterialMain;
