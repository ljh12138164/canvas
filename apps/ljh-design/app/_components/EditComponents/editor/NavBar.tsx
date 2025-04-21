import TooltipComponents from '@/app/_components/Comand/Tooltip';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Separator } from '@/app/_components/ui/separator';
import { useCreateMaterial, useMaterial } from '@/app/_hook/query/useMaterial';
import { useMediaQuery } from '@/app/_hook/useMediaQuery';
import { useSave } from '@/app/_store/save';
import { type Edit, type EditType, Tool } from '@/app/_types/Edit';
import type * as Fabric from 'fabric';
import { useRouter } from 'next/navigation';
import { Fragment, useMemo, useRef } from 'react';
import { BsCloud, BsCloudCheck, BsFiletypeJson, BsFiletypePdf } from 'react-icons/bs';
import {
  LuArrowLeft,
  LuChevronDown,
  LuDownload,
  LuEye,
  LuFile,
  LuMousePointerClick,
  LuRedo2,
  LuTrash,
  LuUndo2,
} from 'react-icons/lu';
import { useFilePicker } from 'use-file-picker';
import { Response } from '../../Comand/Response';
import { ThemeToggle } from '../../Comand/ThemeToggle';
import UserButton from '../../Comand/UserButton';
import { Form } from '../../Material/Form';
import { Logo } from '../../ui/Logo';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
const titles: Record<EditType, string> = {
  board: '画布编辑器',
  template: '模板编辑器',
  material: '素材编辑器',
};

interface NavBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeTool: (tool: Tool) => void;
  isPending?: boolean;
  userId?: string;
  type: EditType;
  // userState: [number, UserState][];
}
const NavBar = ({
  activeTool,
  onChangeTool,
  editor,
  isPending,
  userId,
  type,
  // userState,
}: NavBarProps) => {
  const router = useRouter();
  const { data: material, isLoading } = useMaterial();
  const { isPending: materialPending } = useCreateMaterial();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { cloudSave } = useSave();
  const saveCloseRef = useRef<{
    closeModel: () => void;
  }>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // 读取json文件
  const { openFilePicker } = useFilePicker({
    accept: '.json',
    onFilesSelected: ({ plainFiles }) => {
      const file = plainFiles[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const json = reader.result;
        editor?.loadFromJson(json as string);
      };
    },
  });
  const { openFilePicker: onPDFPicker } = useFilePicker({
    accept: '.pdf',
    onFilesSelected: ({ plainFiles }) => {
      const file = plainFiles[0];
      if (!file) return;
      editor?.importPDFFILE(file);
    },
  });

  const isGroup = useMemo(() => {
    // 如果未选择对象，则不保存
    if (!editor?.selectedObject) return false;
    // 如果选择的对象数量为1，且对象为素材，则不保存
    if (editor?.selectedObject?.length === 1 && editor?.selectedObject?.[0]?.saveType) return false;
    // 如果选择的对象数量小于等于1，则不保存
    if (editor?.selectedObject?.length <= 1) return false;
    // 如果选择的对象数量大于1，且对象为素材，则不保存
    const isGroup = editor?.selectedObject?.every((item) => {
      // 如果为group
      if (item.saveType) return false;
      return true;
    });
    return isGroup;
  }, [editor?.selectedObject]);
  const grupState = useMemo(() => {
    if (editor?.selectedObject?.length && editor?.selectedObject?.length >= 2) return 'notGroup';
    if (
      editor?.selectedObject?.length &&
      editor?.selectedObject?.length === 1 &&
      editor.selectedObject[0].saveType &&
      !material?.some((item) => item.id === editor?.selectedObject?.[0]?.id)
    )
      return 'group';
    return 'notGroup';
  }, [editor?.selectedObject]);
  return (
    <nav className="w-full text-xl font-medium h-[4rem] bg-[#fff] dark:bg-background flex items-center px-4 border-b  justify-center  xl:justify-start">
      {!isMobile && <Logo to={userId ? '/board' : '/sign-in'} />}
      <div className="ml-4 w-full flex gap-4 h-[4rem] items-center ">
        {isMobile && (
          <TooltipComponents label="返回">
            <Button
              aria-label="返回"
              variant={'ghost'}
              size={'icon'}
              onClick={() => {
                if (!userId) {
                  router.push('/sign-in');
                } else {
                  router.push('/board');
                }
              }}
            >
              <LuArrowLeft size="20" />
            </Button>
          </TooltipComponents>
        )}
        {!isMobile && (
          <p className="text-2xl  line-clamp-1">
            <TooltipComponents label={titles[type]}>
              <span className="text-2xl  line-clamp-1">{titles[type]}</span>
            </TooltipComponents>
          </p>
        )}

        <Separator orientation="vertical" className="mx-2 h-[60%]" />
        <TooltipComponents label="选择">
          <Button
            aria-label="选择"
            variant={'ghost'}
            size={'icon'}
            onClick={() => {
              onChangeTool(Tool.Select);
            }}
            className={`${activeTool === Tool.Select && 'bg-gray-100 dark:bg-slate-700'}`}
          >
            <LuMousePointerClick size="20" />
          </Button>
        </TooltipComponents>
        {/* 清空画布 */}
        <TooltipComponents label="清空画布">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'ghost'} size={'icon'} aria-label="清空画布">
                <LuTrash size="20" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>清空画布</DialogTitle>
                <DialogDescription>将清空画布中的所有内容</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" ref={closeRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    editor?.clear();
                    closeRef.current?.click();
                  }}
                  variant="destructive"
                >
                  清空
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipComponents>
        {/* 预览 */}
        <TooltipComponents label="预览">
          <Button
            aria-label="预览"
            variant={'ghost'}
            size={'icon'}
            onClick={() => {
              editor?.savePng(true);
            }}
          >
            <LuEye size="20" />
          </Button>
        </TooltipComponents>
        {/* 撤销 */}
        <TooltipComponents label="撤销">
          <Button
            disabled={!editor?.canUndo()}
            variant={'ghost'}
            size={'icon'}
            onClick={() => {
              editor?.undo();
            }}
            aria-label="撤销"
          >
            <LuUndo2 size="20" />
          </Button>
        </TooltipComponents>
        {/* 重做 */}
        <TooltipComponents label="重做">
          <Button
            disabled={!editor?.canRedo()}
            variant={'ghost'}
            size={'icon'}
            onClick={() => editor?.redo()}
            aria-label="重做"
          >
            <LuRedo2 size="20" />
          </Button>
        </TooltipComponents>
        <Separator orientation="vertical" className="mx-2 h-[60%]" />
        <div className="flex items-center gap-2  ">
          {/* 只有用户登录后才显示 */}
          {type !== 'material' && userId && (
            <Fragment>
              {!cloudSave ? (
                <Fragment>
                  <BsCloud size={20} />
                  <p className="text-xs w-[100px]  text-muted-foreground line-clamp-1">未保存</p>
                </Fragment>
              ) : isPending ? (
                <Fragment>
                  <BsCloud size={20} />
                  <p className="text-xs w-[100px]  line-clamp-1">
                    {type === 'board' ? '画布保存中' : '模板保存中'}
                  </p>
                </Fragment>
              ) : (
                <Fragment>
                  <BsCloudCheck size={20} />
                  <p className="text-xs w-[100px]  line-clamp-1">
                    {type === 'board' ? '画布保存成功' : '模板保存成功'}
                  </p>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
        <div className="flex items-center justify-between gap-x-2 w-full">
          <section>
            {type === 'material' && !isLoading && isGroup && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.setMaterial(editor?.selectedObject || [])}
              >
                设置为素材
              </Button>
            )}
            {grupState === 'group' && (
              <Response
                title="保存为素材"
                myTrigger={
                  <Button variant="outline" size="sm">
                    保存为素材
                  </Button>
                }
                showFooter={false}
                description="保存为素材后，可以随时使用"
                ref={saveCloseRef}
              >
                <Form
                  selectedObject={editor?.selectedObject?.[0] as Fabric.Group}
                  // editor={editor}
                  onSuccess={() => {
                    saveCloseRef.current?.closeModel();
                  }}
                >
                  <div className="flex justify-end my-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveCloseRef.current?.closeModel()}
                    >
                      取消
                    </Button>
                    <Button type="submit" size="sm" disabled={materialPending}>
                      保存
                    </Button>
                  </div>
                </Form>
              </Response>
            )}
          </section>
          <section className="flex items-center gap-2">
            {type !== 'material' && !cloudSave && (
              <Button variant="ghost" size="sm" disabled={isPending}>
                保存
              </Button>
            )}
            {/* 导出 */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <p>导出</p>
                  <LuDownload size="18" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40 z-1000">
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => editor?.saveJson()}
                >
                  <LuFile size={20} />
                  <div className="flex flex-col">
                    <p className="text-xs ">JSON</p>
                    <p className="text-xs ">保存最后一次编辑</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => editor?.savePng()}
                >
                  <LuFile size={20} />
                  <div className="flex flex-col">
                    <p className="text-xs ">PNG</p>
                    <p className="text-xs ">可以分享给别人看</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => editor?.savejpg()}
                >
                  <LuFile size={20} />
                  <div className="flex flex-col">
                    <p className="text-xs ">JPG</p>
                    <p className="text-xs text-muted-foreground">可以分享给别人看</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => editor?.savePdf()}
                >
                  <BsFiletypePdf size={20} />
                  <div className="flex flex-col">
                    <p className="text-xs ">PDF</p>
                    <p className="text-xs text-muted-foreground">可以分享给别人看</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => editor?.saveSvg()}
                >
                  <LuFile size={20} />
                  <div className="flex flex-col">
                    <p className="text-xs ">SVG</p>
                    <p className="text-xs text-muted-foreground">可在其他的矢量软件中使用</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* 导入文件 */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  导入文件
                  <LuChevronDown size={20} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-60 z-1000">
                <DropdownMenuItem
                  onClick={() => {
                    openFilePicker();
                  }}
                  className="flex items-center gap-2 px-4 cursor-pointer"
                >
                  <BsFiletypeJson size={30} />
                  <div className="z-1000">
                    <p>打开</p>
                    <p className="text-xs  opacity-45">请选择json文件</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onPDFPicker();
                  }}
                  className="flex items-center gap-2 px-4 cursor-pointer"
                >
                  <BsFiletypePdf size={30} />
                  <div className="z-1000">
                    <p>打开</p>
                    <p className="text-xs  opacity-45">请选择pdf文件</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
            {userId && <UserButton />}
          </section>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

//  <div className="flex items-center gap-2 text-xs">
//   <LuUser size={20} />
//   <TooltipProvider>
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <p>
//           当前在线：
//           {userState.length}
//         </p>
//       </TooltipTrigger>
//       <TooltipContent className="z-1000 max-h-[200px] overflow-y-scroll" asChild>
//         <ScrollArea className="max-h-[200px]">
//           <section className="flex flex-col gap-2">
//             {userId &&
//               userState &&
//               userState?.map((item) => {
//                 return (
//                   <div key={item[0]} className="flex items-center gap-2">
//                     <Avatar
//                       className="size-8 border-2"
//                       style={{
//                         borderColor: getUserColor(item[1].user.id),
//                       }}
//                     >
//                       <AvatarImage src={item[1].user.image} />
//                       <AvatarFallback className="bg-gray-200">
//                         {item[1].user.name}
//                       </AvatarFallback>
//                     </Avatar>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <p className="text-xs  text-ellipsis max-w-14 whitespace-nowrap">
//                           {item[1].user.name}
//                           {item[1].user.isSelf && '（我）'}
//                         </p>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 );
//               })}
//           </section>
//         </ScrollArea>
//       </TooltipContent>
//     </Tooltip>
//   </TooltipProvider>
// </div>
