import Logo from '../Comand/Logo';
import SiderBarRoutes from './SiderBarRoutes';

const SiderBar = ({
  hide,
  closeRef,
}: {
  hide?: boolean;
  closeRef?: React.RefObject<HTMLButtonElement | null>;
}) => {
  return (
    <aside
      className={`bg-muted transition-all ${
        !hide ? 'hidden' : 'flex'
      }  duration-300s fixed flex-col w-[300px] left-0 shrink-0 h-full lg:flex`}
    >
      {!hide && (
        <div className='m-2 flex items-center gap-x-4'>
          <Logo to='/' />
          <span className='text-xl font-semibold text-primary'>ljh-design</span>
        </div>
      )}
      <SiderBarRoutes closeRef={closeRef} />
    </aside>
  );
};

export default SiderBar;
