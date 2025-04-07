import { cn } from '@/app/_lib/utils';
import type { Profiles, Sessions } from '@/app/_types/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AvatarImage = ({
  src,
  alt,
  width,
  priority,
  className,
  height,
  userInfo,
  jump = true,
}: {
  src: string;
  alt: string;
  width: number;
  priority: boolean;
  className?: string;
  height: number;
  userInfo?: Sessions['user']['user_metadata'] | Profiles;
  jump?: boolean;
}) => {
  const router = useRouter();
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn('rounded-full aspect-square object-cover', className)}
      onClick={() => {
        if (userInfo?.id && jump) {
          router.push(`/user/${userInfo.id}`);
        }
      }}
    />
  );
};

export default AvatarImage;
