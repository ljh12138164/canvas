"use client";
import { Separator } from "@/app/_components/ui/separator";
import { Home, User, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import SiderBarItem from "./SiderBarItem";

const SiderBarRoutes = () => {
  const pathname = usePathname();
  return (
    <section className="flex flex-col gap-y-4 flex-1">
      <div className="px-4">
        <Separator />
      </div>
      <ul className="flex flex-col h-full">
        <li className="flex-1 p-4 flex flex-col gap-y-4">
          <SiderBarItem
            href="/board"
            label="主页"
            Icon={Home}
            isActive={pathname === "/board"}
          />
          <SiderBarItem
            href="/board/formue"
            label="论坛"
            Icon={MessageSquare}
            isActive={pathname.split("/").includes("formue")}
          />
        </li>
        <Separator />
        <li className="p-4">
          <SiderBarItem
            href="/board/user"
            label="用户"
            Icon={User}
            isActive={pathname === "/board/user"}
          />
        </li>
      </ul>
    </section>
  );
};

export default SiderBarRoutes;