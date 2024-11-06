"use client";
import { Separator } from "@/components/ui/separator";
import SiderBarItem from "./SiderBarItem";
import { Home, User } from "lucide-react";
import { redirect, usePathname } from "next/navigation";

const SiderBarRoutes = () => {
  const pathname = usePathname();
  return (
    <section className="flex flex-col gap-y-4 flex-1">
      <div className="px-4">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1">
        <li className="px-4 my-1 w-full flex flex-col gap-6">
          <SiderBarItem
            href="/board  "
            label="主页"
            Icon={Home}
            isActive={pathname === "/board"}
            onClick={() => {
              redirect("/board");
            }}
          ></SiderBarItem>
          <SiderBarItem
            href="/board/user"
            label="用户"
            Icon={User}
            isActive={pathname === "/board/user"}
            onClick={() => {
              redirect("/board");
            }}
          ></SiderBarItem>
        </li>
      </ul>
    </section>
  );
};

export default SiderBarRoutes;
