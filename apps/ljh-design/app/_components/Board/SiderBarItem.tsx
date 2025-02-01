import { cn } from '@/app/_lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
interface SiderBarItemProps {
  label: string;
  Icon: LucideIcon;
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
        'flex items-center px-3 py-3 rounded-xl bg-transparent dark:bg-[#312e812b] hover:bg-indigo-100 dark:hover:bg-[#000] duration-300 transition',
        isActive ? 'text-blue-500 border-l-[3px] border-blue-500 bg-indigo-100 dark:bg-[#000]' : '',
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
