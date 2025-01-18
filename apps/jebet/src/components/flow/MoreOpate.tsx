import useUser from "@/store/user";
import { EyeIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useDeleteFlow } from "@/server/hooks/flow";
import { Flow } from "@/types/workspace";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useRef } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Form from "./Form";

const MoreOpate = observer(({ row }: { row: Row<Flow> }) => {
  const workspaceId = useParams().workspaceId;
  const queryClient = useQueryClient();
  const deleteRef = useRef<HTMLButtonElement>(null);
  const { deleteFlow, deleteFlowPending } = useDeleteFlow();
  if (!workspaceId || !useUser.userData) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <MoreVerticalIcon className="w-4 h-4 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[100px]">
        <DropdownMenuItem asChild>
          <Link to={`detail/${row.original.id}`}>
            <Button variant="ghost" className="w-full cursor-pointer">
              <EyeIcon className="w-4 h-4" />
              <span>详细</span>
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full cursor-pointer">
                <PencilIcon className="w-4 h-4" />
                <span>编辑</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑文件</DialogTitle>
              </DialogHeader>
              <Form
                type="update"
                defaultData={row.original}
                userId={useUser.userData.id}
                workspaceId={workspaceId}
              />
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full cursor-pointer">
                <TrashIcon className="w-4 h-4" />
                <span>删除</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>删除文件</DialogTitle>
                <DialogDescription>
                  确认删除文件
                  <span className="text-red-500 font-bold">
                    {row.original.name}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" ref={deleteRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={deleteFlowPending}
                  onClick={() => {
                    if (!useUser.userData) return;
                    deleteFlow(
                      {
                        json: {
                          userId: useUser.userData.id,
                          id: row.original.id,
                          workspaceId: workspaceId,
                        },
                      },
                      {
                        onSuccess: () => {
                          toast.success("删除成功");
                          queryClient.invalidateQueries({
                            queryKey: ["flow", workspaceId],
                          });
                          deleteRef.current?.click();
                        },
                        onError: () => {
                          toast.error("删除失败");
                        },
                      }
                    );
                  }}
                >
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default MoreOpate;