import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="h-12 w-12 cursor-pointer flex items-center justify-center"
    >
      <Image
        width={48}
        height={48}
        src="https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/favicon.ico"
        alt="logo"
      />
    </Link>
  );
};

export default Logo;
