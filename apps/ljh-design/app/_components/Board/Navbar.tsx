import UserButton from "../Comand/UserButton";

const NavBar = () => {
  return (
    <nav className="bg-slate-200 flex p-4 items-center h-[60px] w-full">
      <div className="ml-auto">
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
