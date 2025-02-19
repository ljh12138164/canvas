import { cn } from '@/lib/utils';
interface DottedSeparatorProps {
  className?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: 'horizontal' | 'vertical';
}
const DottedSeparator = ({
  className,
  color = '#d4d4d8',
  height = '2px',
  dotSize = '2px',
  gapSize = '6px',
  direction = 'horizontal',
}: DottedSeparatorProps) => {
  const isHorizontal = direction === 'horizontal';
  return (
    <div
      className={cn(
        className,
        isHorizontal ? 'w-full flex items-center' : 'h-full flex flex-col items-center',
      )}
    >
      <div
        className={isHorizontal ? 'grow' : 'grow-0'}
        style={{
          width: isHorizontal ? '100%' : height,
          height: isHorizontal ? height : '100%',
          backgroundColor: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${Number.parseInt(dotSize) + Number.parseInt(gapSize)}px ${height}`
            : `${height} ${Number.parseInt(dotSize) + Number.parseInt(gapSize)}px`,
          backgroundRepeat: isHorizontal ? 'repeat-x' : 'repeat-y',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
};

export default DottedSeparator;
