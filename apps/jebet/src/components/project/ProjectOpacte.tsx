import { TaskWithWorkspace } from "@/types/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ExternalLinkIcon,
  MoreVertical,
  PencilIcon,
  Trash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import userStore from "@/store/user";
import { observer } from "mobx-react-lite";
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
import { useDeleteTask } from "@/server/hooks/tasks";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
const ProjectOpacte = observer(({ task }: { task: TaskWithWorkspace }) => {
  const { userData } = userStore;
  const { workspaceId, projectId } = useParams();
  const { deleteTask, deleteTaskLoading } = useDeleteTask();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleDeleteTask = () => {
    if (!workspaceId || !projectId || !task.id) return;
    if (!userData?.id) return toast.error("请先登录");
    toast.dismiss();
    toast.loading("删除中...");
    deleteTask(
      {
        query: {
          currentUserId: userData?.id,
          workspaceId: workspaceId,
          projectId: projectId,
          id: task.id,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["taskList"] });
          toast.dismiss();
          toast.success("删除成功");
          closeRef.current?.click();
        },
      }
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Link to={`${task.id}`}>
            <MoreVertical />
            <span className="sr-only">细节</span>
          </Link>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Button variant="ghost" className="w-full cursor-pointer">
            <PencilIcon />
            <span>编辑</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full cursor-pointer"
            onClick={() => navigate(`${task.id}`)}
          >
            <ExternalLinkIcon />
            <span>打开</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full cursor-pointer">
                <Trash className="text-red-500 hover:text-red-500" />
                <span className="text-red-500 hover:text-red-500">删除</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>删除任务</DialogTitle>
                <DialogDescription>
                  你确定要删除这个任务{task.name}吗?
                  <span className="text-red-500">删除后将无法恢复</span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button ref={closeRef} variant="outline">
                    取消
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTask}
                  disabled={deleteTaskLoading}
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

export default ProjectOpacte;
