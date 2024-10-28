"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuLogOut } from "react-icons/lu";

const UserButton = () => {
  //TODO: 获取用户信息
  return (
    // @ts-ignore
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
  );
};

export default UserButton;
