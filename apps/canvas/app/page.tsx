import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const ramdom = Math.random() * 100;
  return (
    <div>
      <Link href={`edit/${ramdom}`}>55555555</Link>
    </div>
  );
}
