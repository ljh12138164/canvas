import { useDeleteTask } from "@/server/hooks/tasks";
import userStore from "@/store/user";
import { TaskWithWorkspace } from "@/types/workspace";
import { useQueryClient } from "@tanstack/react-query";
import { Link, MoreVertical, PencilIcon, Trash } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
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
import TaskFromCard from "./TaskFromCard";
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
        json: {
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

  if (!workspaceId || !projectId || !userData) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full cursor-pointer"
          onClick={() =>
            navigate(`/dashboard/${workspaceId}/${projectId}/${task.id}`)
          }
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full cursor-pointer"
            onClick={() => navigate(`${task.id}`)}
          >
            <Link />
            <span>细节</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <TaskFromCard
            workspaceId={workspaceId}
            projectId={projectId}
            type="edit"
            userData={task.workspace.member}
            currentUserId={userData.id}
          >
            <Button variant="ghost" className="w-full cursor-pointer">
              <PencilIcon />
              <span>编辑</span>
            </Button>
          </TaskFromCard>
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
