import { cn } from '@/app/_lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
interface SiderBarItemProps {
  label: string;
  Icon: LucideIcon;
  href: string;
  isActive?: boolean;
  closeRef?: React.RefObject<HTMLButtonElement | null>;
}
const SiderBarItem = ({ label, Icon, href, isActive, closeRef }: SiderBarItemProps) => {
  return (
    <Link
      onClick={() => {
        if (closeRef) {
          closeRef.current?.click();
        }
      }}
      href={href}
      className={cn(
        'flex items-center px-3 py-3 rounded-xl bg-transparent dark:bg-[#312e812b] hover:bg-indigo-50/80 dark:hover:bg-[#312e8188] duration-300 transition',
        isActive
          ? 'text-blue-500 border-l-[3px] border-blue-500 bg-indigo-50/80 dark:bg-[#312e8188]'
          : '',
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
