import { cn } from '@/lib/utils';
import { TaskStatus, TasksPriority } from '@/types/workspace';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive dark:text-black text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        [TaskStatus.BACKLOG]: 'bg-pink-500 text-primary  dark:text-black hover:bg-pink-400/80',
        [TaskStatus.TODO]:
          'border-transparent bg-red-400 text-primary dark:text-black hover:bg-red-400/80',
        [TaskStatus.DONE]:
          'border-transparent bg-emerald-400 text-primary dark:text-black hover:bg-emerald-500',
        [TaskStatus.IN_REVIEW]:
          'border-transparent bg-blue-400 text-primary  dark:text-black hover:bg-blue-400/80',
        [TaskStatus.IN_PROGRESS]:
          'border-transparent bg-yellow-400 text-primary dark:text-black hover:bg-yellow-400/80',
        [TaskStatus.ALL || TasksPriority.ALL]:
          'border-transparent bg-emerald-400 text-primary dark:text-black hover:bg-emerald-500',
        [TasksPriority.URGENT]:
          'border-transparent bg-red-400 text-primary dark:text-black hover:bg-red-400/80',
        [TasksPriority.GENERAL]:
          'border-transparent bg-emerald-400 text-primary dark:text-black hover:bg-emerald-500',
        [TasksPriority.SUGGESTION]:
          'border-transparent bg-blue-400 text-primary  dark:text-black hover:bg-blue-400/80',
        [TasksPriority.IMPORTANT]:
          'border-transparent bg-yellow-400 text-primary dark:text-black hover:bg-yellow-400/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
