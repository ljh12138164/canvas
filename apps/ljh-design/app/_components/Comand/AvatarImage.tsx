import { cn } from '@/app/_lib/utils';
import Image from 'next/image';

const AvatarImage = ({
  src,
  alt,
  width,
  priority,
  className,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  priority: boolean;
  className?: string;
  height: number;
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn('rounded-full', className)}
    />
  );
};

export default AvatarImage;
