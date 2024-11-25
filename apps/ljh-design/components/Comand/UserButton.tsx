"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut, useUserQuery } from "@/hook/query/useUserQuery";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";
import { Skeleton } from "../ui/skeleton";
import { User } from "lucide-react";

const UserButton = () => {
  const routers = useRouter();
  const { isLoading, data } = useUserQuery();

  const { signOutMutate, signOutPending } = useSignOut();
  return (
    <>
      {isLoading ? (
        <Skeleton className="size-10 rounded-full"></Skeleton>
      ) : (
        //  @ts-ignore
        <DropdownMenu modal={false}>
          {/* @ts-ignore */}
          <DropdownMenuTrigger>
            <Avatar className="size-10 hover:opacity-80 transition-all duration-300 ">
              <AvatarImage alt="用户头像" src={data?.image} />
              <AvatarFallback>{data?.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem
              className="h-10 cursor-pointer"
              disabled={signOutPending}
              onClick={() => {
                signOutMutate(undefined, {
                  onSuccess: () => {
                    toast.dismiss();
                    toast.success("登出成功");
                    routers.refresh();
                  },
                  onError: () => {
                    toast.dismiss();
                    toast.error("登出失败");
                  },
                });
              }}
            >
              <User className="size-4 mr-2 " />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem
              className="h-10 cursor-pointer"
              disabled={signOutPending}
              onClick={() => {
                localStorage.removeItem("token");
                redirect("/board/sign-in");
              }}
            >
              <LuLogOut className="size-4 mr-2 " />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserButton;
