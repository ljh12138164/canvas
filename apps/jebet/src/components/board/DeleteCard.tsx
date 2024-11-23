import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteWorkspace } from "@/server/hooks/board";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export default function DeleteCard({
  canEdit,
  workspaceId,
  userId,
}: {
  canEdit: boolean;
  workspaceId: string;
  userId: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { deleteWorkspace, isDeleting } = useDeleteWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleDelete = () => {
    deleteWorkspace(
      { param: { id: workspaceId }, json: { userId } },
      {
        onSuccess: () => {
          toast.success("删除成功");
          queryClient.invalidateQueries({ queryKey: ["workspace", userId] });
          closeRef.current?.click();
          navigate("/dashboard/home");
        },
      }
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>删除工作区</CardTitle>
        <CardDescription>
          删除工作区将删除所有工作区数据，请谨慎操作
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={!canEdit}>
              删除工作区
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除工作区</DialogTitle>
              <DialogDescription>
                删除工作区将删除所有工作区数据，请谨慎操作
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" ref={closeRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "删除中..." : "删除工作区"}
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
