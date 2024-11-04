import { UserQuery } from "@/types/user";
import UserButton from "../Comand/UserButton";
interface NavBarProps {
  userHook: UserQuery;
}
const NavBar = ({ userHook }: NavBarProps) => {
  return (
    <nav className="bg-muted flex p-4 items-center h-[60px] w-full">
      <div className="ml-auto">
        <UserButton userHook={userHook} />
      </div>
    </nav>
  );
};

export default NavBar;
