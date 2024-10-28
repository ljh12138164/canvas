import Logo from "../Comand/Logo";
import SiderBarRoutes from "./SiderBarRoutes";

const SiderBar = () => {
  return (
    <aside className="hidden bg-slate-200 transition-all duration-300s lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
      <div className="m-2 ">
        <Logo />
      </div>
      <SiderBarRoutes></SiderBarRoutes>
    </aside>
  );
};

export default SiderBar;
