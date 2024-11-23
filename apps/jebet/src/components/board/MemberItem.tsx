import { Member } from "@/types/workspace";
import { FaEllipsisH, FaUser, FaUserCog } from "react-icons/fa";
import styled from "styled-components";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
import { useDeleteJebtUser, useSetJebtUserInfo } from "@/server/hooks/user";
import { useRef } from "react";
import { useMemoizedFn } from "ahooks";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const UserInfoContain = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const MemberContain = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;
`;
const Operation = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const UserImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const UserName = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const OperationButton = styled(Button)`
  width: 100%;
  cursor: pointer;
`;
const MemberItem = ({
  user,
  isAdmin,
  canOperation,
  currentUserId,
}: {
  user: Member;
  canOperation: boolean;
  isAdmin: boolean;
  currentUserId: string;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeRef2 = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const { newRoleData, newRoleIsPending } = useSetJebtUserInfo();
  const { deleteData, deleteIsPending } = useDeleteJebtUser();
  const navigate = useNavigate();

  const handleSetRole = useMemoizedFn(() => {
    newRoleData(
      {
        json: {
          userId: user.userId,
          role: isAdmin ? "member" : "admin",
          workspaceId: user.workspaceId,
          currentUserId: currentUserId,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["userList", user.workspaceId],
          });
          closeRef.current?.click();
          toast.success("修改成功");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  });
  const handleDelete = useMemoizedFn(() => {
    deleteData(
      {
        json: {
          userId: user.userId,
          workspaceId: user.workspaceId,
          currentUserId: currentUserId,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["userList", user.workspaceId],
          });
          closeRef2.current?.click();
          toast.success("删除成功");
          if (currentUserId === user.userId) {
            navigate("/dashboard/home");
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  });
  return (
    <MemberContain>
      <UserInfoContain>
        <UserImage src={user.userImage} alt={user.username || ""} />
        <UserInfo>
          <UserName>
            {user.username}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {isAdmin ? <FaUserCog size={16} /> : <FaUser size={16} />}
                </TooltipTrigger>
                <TooltipContent>{isAdmin ? "管理员" : "成员"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </UserName>
          <span>{user.email}</span>
        </UserInfo>
      </UserInfoContain>
      <Operation>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <FaEllipsisH size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-2">
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger
                  disabled={!canOperation || currentUserId === user.userId}
                  className={!canOperation ? "cursor-not-allowed" : ""}
                >
                  <OperationButton
                    variant="ghost"
                    disabled={!canOperation || currentUserId === user.userId}
                    className={!canOperation ? "cursor-not-allowed" : ""}
                  >
                    {isAdmin ? "设置为成员" : "设置为管理员"}
                  </OperationButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isAdmin ? "设置为成员" : "设置为管理员"}
                    </DialogTitle>
                    <DialogDescription>
                      将该成员
                      <span className="font-bold mx-2">{user.username}</span>
                      设置为
                      {isAdmin ? "成员" : "管理员"}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" ref={closeRef}>
                        取消
                      </Button>
                    </DialogClose>

                    <Button
                      variant="destructive"
                      disabled={
                        currentUserId === user.userId ||
                        !canOperation ||
                        newRoleIsPending
                      }
                      onClick={handleSetRole}
                    >
                      确定
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger
                  disabled={!canOperation || currentUserId === user.userId}
                  className={!canOperation ? "cursor-not-allowed" : ""}
                >
                  <OperationButton
                    variant="ghost"
                    disabled={currentUserId === user.userId || !canOperation}
                    className={
                      currentUserId === user.userId || !canOperation
                        ? "cursor-not-allowed"
                        : ""
                    }
                  >
                    <p className="text-red-500">
                      {currentUserId === user.userId
                        ? "退出工作区"
                        : "删除该成员"}
                    </p>
                  </OperationButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentUserId === user.userId
                        ? "退出工作区"
                        : "删除该成员"}
                    </DialogTitle>
                    <DialogDescription>
                      {currentUserId === user.userId ? (
                        "退出工作区后，将无法再访问该工作区"
                      ) : (
                        <>
                          删除该成员
                          <span className="font-bold mx-2">
                            {user.username}
                          </span>
                          后，该成员将无法再访问该工作区
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" ref={closeRef2}>
                        取消
                      </Button>
                    </DialogClose>

                    <Button
                      variant="destructive"
                      disabled={
                        currentUserId === user.userId ||
                        !canOperation ||
                        deleteIsPending
                      }
                      onClick={handleDelete}
                    >
                      确定
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Operation>
    </MemberContain>
  );
};

export default MemberItem;
