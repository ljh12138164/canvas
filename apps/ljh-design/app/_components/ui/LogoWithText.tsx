import { cn } from '@/app/_lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* 图标容器 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* SVG图标 */}
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg
          aria-label="logo"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* 背景形状 - 圆角正方形 */}
          <rect x="5" y="5" width="90" height="90" rx="20" className="fill-primary/10" />

          {/* L字母形状 */}
          <path
            d="M25 25 L25 75 L75 75"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary"
          />

          {/* 画笔/铅笔元素 */}
          <path
            d="M60 25 L75 40 L50 65"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-secondary"
          />

          {/* 点缀元素 */}
          <circle cx="75" cy="25" r="8" className="fill-primary" />
        </svg>
      </div>
    </div>
  );
}

// 带文字的Logo组件
export function LogoWithText({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Logo size={size} />
      <span
        className={cn(
          'font-bold',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
          size === 'xl' && 'text-3xl',
        )}
      >
        ljh-design
      </span>
    </div>
  );
}
