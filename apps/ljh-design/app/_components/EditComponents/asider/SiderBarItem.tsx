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
    <Button variant="ghost" onClick={onClick} className={cn(`w-full h-[5rem] aspect-video p-5 flex flex-col font-light   rounded-none ${isActive && 'bg-muted text-primary'}`, className)}>
      <Icon size={24} className="stroke-2 shrink-0" />
      <span className="mt-2 text-[1rem]">{label}</span>
    </Button>
  );
};

export default SiderBarItem;
