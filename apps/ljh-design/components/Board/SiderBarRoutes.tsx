"use client";
import { Separator } from "@/components/ui/separator";
import SiderBarItem from "./SiderBarItem";
import { Home } from "lucide-react";
import { redirect, usePathname } from "next/navigation";

const SiderBarRoutes = () => {
  const pathname = usePathname();
  return (
    <section className="flex flex-col gap-y-4 flex-1">
      <div className="px-4">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1">
        <li className="px-4 my-1 w-full ">
          <SiderBarItem
            href="/board  "
            label="Home"
            Icon={Home}
            isActive={pathname === "/board"}
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
