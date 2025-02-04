import { useBoardQuery } from '@/app/_hook/query/useBoardQuery';
import { inter, myFont } from '@/app/_lib/font';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import BoardCreateFrom from '../Board/BoardCreateFrom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import 'react-photo-view/dist/react-photo-view.css';

interface Template {
  id: string;
  name: string;
  description: string;
  json: string;
  image: string;
  default?: boolean;
}
// 模拟一些模板数据
const templates: Template[] = [
  {
    id: '1',
    name: '简约博客',
    image:
      'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteOne.png',
    json: 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteOne.json',
    description: '清新简约的博客模板',
    default: true,
  },
  {
    id: '2',
    name: '电商首页',
    image:
      'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteTwo.png',
    json: 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteTwo.json',
    description: '现代化电商网站模板',
    default: true,
  },
  {
    id: '3',
    name: '电商首页',
    image:
      'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteThree.png',
    json: 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteThree.json',
    description: '现代化电商网站模板',
    default: true,
  },
  {
    id: '4',
    name: '电商首页',
    image:
      'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteFour.png',
    json: 'https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui//templasteFour.json',
    description: '现代化电商网站模板',
    default: true,
  },
];

const TemplateMain = ({ userId }: { userId: string }) => {
  const { mutate, isPending } = useBoardQuery();

  const closeref = useRef<HTMLButtonElement>(null);
  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <main className={`${inter.className} ${myFont.variable} min-w-[380px] p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">模板中心</h1>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            创建模板
          </Button>
        </div>
        <h2 className="text-lg font-bold mb-4">默认模板</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <PhotoProvider>
                  <PhotoView src={template.image}>
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      quality={80}
                      className="object-cover w-full h-full"
                    />
                  </PhotoView>
                </PhotoProvider>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm">
                        使用模板
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle> {template.name} </DialogTitle>
                      </DialogHeader>
                      <BoardCreateFrom
                        type="create"
                        isTemplate={true}
                        userId={userId}
                        mutate={mutate as any}
                        closeref={closeref}
                        templateData={template.json}
                      >
                        <DialogFooter className="flex gap-2 w-full">
                          <Button onClick={() => closeref.current?.click()} variant="outline">
                            取消
                          </Button>
                          <Button variant="default" type="submit">
                            使用模板
                          </Button>
                        </DialogFooter>
                      </BoardCreateFrom>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    预览
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <h2 className="text-lg font-bold mb-4">我的模板</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6" />
      </main>
    </ScrollArea>
  );
};

export default TemplateMain;
