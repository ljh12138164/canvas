import { Button } from '@/app/_components/ui/button';
import { cn } from '@/app/_lib/utils';
import type { IconType } from 'react-icons';
interface SiderBarItemProps {
  icon: IconType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}
const SiderBarItem = ({ icon: Icon, label, isActive, onClick, className }: SiderBarItemProps) => {
  return (
    <li>
      <Button
        aria-label={label}
        variant="ghost"
        onClick={onClick}
        className={cn(
          `w-full h-[5rem] aspect-video p-5 flex flex-col font-light dark:bg-background rounded-none dark:hover:bg-slate-700 ${isActive && ' bg-muted dark:bg-slate-700 text-primary'}`,
          className,
        )}
      >
        <Icon size={24} className="stroke-2 shrink-0" />
        <span className="mt-2">{label}</span>
      </Button>
    </li>
  );
};

export default SiderBarItem;
