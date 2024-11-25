import { useIsMobile } from "@/hooks/use-mobile";
import { Member } from "@/types/workspace";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawerui";
import TaskFrom from "./TaskFrom";

const TaskFromCard = ({
  children,
  type,
  workspaceId,
  projectId,
  userData,
  currentUserId,
}: {
  children: React.ReactNode;
  type: "create" | "edit";
  workspaceId: string;
  projectId: string;
  userData: Member[] | undefined;
  currentUserId: string;
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>{children}</DrawerTrigger>
        <DrawerContent className="py-4">
          <DrawerHeader>
            <DrawerTitle>
              {type === "create" ? "添加任务" : "编辑任务"}
            </DrawerTitle>
          </DrawerHeader>
          <TaskFrom
            workspaceId={workspaceId}
            projectId={projectId}
            isMobile={isMobile}
            type={type}
            userData={userData}
            currentUserId={currentUserId}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="py-4">
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "添加任务" : "编辑任务"}
          </DialogTitle>
        </DialogHeader>
        <TaskFrom
          workspaceId={workspaceId}
          projectId={projectId}
          type={type}
          userData={userData}
          isMobile={isMobile}
          currentUserId={currentUserId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskFromCard;
