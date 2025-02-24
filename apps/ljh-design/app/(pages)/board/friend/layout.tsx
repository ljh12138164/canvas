import FriendMain from '@/app/_components/Friend/FriendMain';

export default function FriendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FriendMain>{children}</FriendMain>;
}
