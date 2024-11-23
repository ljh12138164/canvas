"use client";
import { Separator } from "@/components/ui/separator";
import { Home, User } from "lucide-react";
import { usePathname } from "next/navigation";
import SiderBarItem from "./SiderBarItem";

const SiderBarRoutes = () => {
  const pathname = usePathname();
  return (
    <section className="flex flex-col gap-y-4 flex-1">
      <div className="px-4">
        <Separator />
      </div>
      {/*  */}
      <ul className="flex flex-col h-full">
        <li className="flex-1 p-4">
          <SiderBarItem
            href="/board"
            label="主页"
            Icon={Home}
            isActive={pathname === "/board"}
          ></SiderBarItem>
        </li>
        <Separator></Separator>
        <li className="p-4">
          <SiderBarItem
            href="/board/user"
            label="用户"
            Icon={User}
            isActive={pathname === "/board/user"}
          ></SiderBarItem>
        </li>
      </ul>
    </section>
  );
};

export default SiderBarRoutes;
