import { cn } from '@/app/_lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
interface SiderBarItemProps {
  label: string;
  Icon: LucideIcon | React.ElementType;
  href: string;
  isActive?: boolean;
  closeRef?: React.RefObject<HTMLButtonElement | null>;
  onClick?: () => void;
}
const SiderBarItem = ({ label, Icon, href, isActive, closeRef, onClick }: SiderBarItemProps) => {
  return (
    <Link
      onClick={() => {
        onClick?.();
        closeRef?.current?.click();
      }}
      href={href}
      className={cn(
        'flex items-center font-medium py-4 px-4 rounded-xl bg-transparent dark:bg-[#1a1a1a] hover:bg-indigo-100/90 dark:hover:bg-[#2a2a2a] duration-300 transition text-gray-700 dark:text-gray-200',
        isActive
          ? 'text-blue-600 dark:text-blue-400 border-l-[3px] font-bold border-blue-500 bg-indigo-100 dark:bg-[#2a2a2a]'
          : '',
      )}
    >
      <section className="flex items-center gap-x-2 ">
        <Icon className="size-6" />
        <span className="test-sm ">{label}</span>
      </section>
    </Link>
  );
};

export default SiderBarItem;
