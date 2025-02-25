import { SidebarGroup, SidebarGroupContent } from '@/app/_components/ui/sidebar';

const FridenNav = () => {
  return (
    <div className="flex flex-col items-center justify-between">
      {/* <div className='flex  gap-1 flex-col w-full p-2'></div> */}
      <form>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">{/* liaotian  */}</SidebarGroupContent>
        </SidebarGroup>
      </form>
    </div>
  );
};

export default FridenNav;
