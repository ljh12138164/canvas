import logo from '@/app/public/logoImage.jpg';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ to }: { to: string }) => {
  return (
    <Link href={to || '/'} className="h-12 w-12 cursor-pointer flex items-center justify-center">
      <Image width={48} quality={75} height={48} src={logo} alt="logo" priority={true} />
    </Link>
  );
};

export default Logo;
