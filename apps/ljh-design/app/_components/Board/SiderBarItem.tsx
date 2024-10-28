import { cn } from "@/lib/utils";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
interface SiderBarItemProps {
  label: string;
  Icon: LucideIcon;
  href: string;
  isActive?: boolean;
  onClick: () => void;
}
const SiderBarItem = ({
  label,
  Icon,
  href,
  isActive,
  onClick,
}: SiderBarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-3 rounded-xl bg-transparent hover:bg-white transition",
        isActive ? "bg-white" : ""
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
