import UserButton from "../Comand/UserButton";
interface NavBarProps {
  userId: string;
}
const NavBar = ({ userId }: NavBarProps) => {
  return (
    <nav className="bg-muted flex p-4 items-center h-[60px] w-full">
      <div className="ml-auto">
        <UserButton userId={userId} />
      </div>
    </nav>
  );
};

export default NavBar;
