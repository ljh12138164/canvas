"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserQuery } from "@/types/user";
import { LuLoader2, LuLogOut } from "react-icons/lu";
interface UserButtonProps {
  userHook: UserQuery;
}
const UserButton = ({ userHook }: UserButtonProps) => {
  const { isLoading } = userHook;
  return (
    <>
      {!isLoading ? (
        <div className="flex justify-center items-center border-4  bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full ">
          <LuLoader2 className="size-8 animate-spin text-white" />
        </div>
      ) : (
        //  @ts-ignore
        <DropdownMenu modal={false}>
          {/* @ts-ignore */}
          <DropdownMenuTrigger>
            <Avatar className="size-10 hover:opacity-80 transition">
              <AvatarImage
                alt="用户头像"
                src="https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/CarbonUserAvatarFilled.png"
              />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem className="h-10" onClick={() => {}}>
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
