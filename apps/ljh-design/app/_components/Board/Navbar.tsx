import { ThemeToggle } from "../Comand/ThemeToggle";
import UserButton from "../Comand/UserButton";

const NavBar = () => {
  return (
    <nav className="bg-muted flex p-4 items-center h-[60px] w-full">
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
