import Logo from "../Comand/Logo";
import SiderBarRoutes from "./SiderBarRoutes";

const SiderBar = () => {
  return (
    <aside className="hidden bg-muted transition-all duration-300s lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
      <div className="m-2 flex items-center gap-x-4">
        <Logo />
        <span className="text-xl font-semibold text-primary">ljh-design</span>
      </div>
      <SiderBarRoutes></SiderBarRoutes>
    </aside>
  );
};

export default SiderBar;
