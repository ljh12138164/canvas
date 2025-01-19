import { cn } from "@/app/_lib/utils";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
interface SiderBarItemProps {
  label: string;
  Icon: LucideIcon;
  href: string;
  isActive?: boolean;
}
const SiderBarItem = ({ label, Icon, href, isActive }: SiderBarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-3 rounded-xl bg-transparent dark:bg-zinc-800 hover:bg-indigo-50/80 dark:hover:bg-zinc-700/80 duration-300 transition",
        isActive
          ? "text-blue-500 border-l-[3px] border-blue-500 bg-indigo-50/80 dark:bg-zinc-700/80"
          : ""
      )}
    >
      <section className="flex items-center gap-x-2">
        <Icon className="size-6" />
        <span className="test-sm font-medium">{label}</span>
      </section>
    </Link>
  );
};

export default SiderBarItem;
