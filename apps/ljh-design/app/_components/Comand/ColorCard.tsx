import { cn } from '@/app/_lib/utils';

const ColorCard = ({
  children,
  icon,
  title,
  className,
}: { children: React.ReactNode; icon: React.ReactNode; title: string; className?: string }) => {
  return (
    <section className="p-2 h-[200px] flex justify-center items-center">
      <div
        className={cn(
          ' bg-linear-to-r grid  grid-cols-[168px_1fr]  w-full h-full rounded-lg p-2 ',
          className,
        )}
      >
        <header className="w-full h-full p-6 flex justify-center items-center">
          <div className="bg-white/50 rounded-full size-28  flex justify-center items-center ">
            <div className="bg-white rounded-full size-20 flex  justify-center items-center z-10">
              {icon}
            </div>
          </div>
        </header>
        <main className="flex flex-col justify-center gap-2">
          <h1 className="text-2xl font-bold text-[#fff] dark:text-[#000]">{title}</h1>
          <div className="flex gap-2">{children}</div>
        </main>
      </div>
    </section>
  );
};

export default ColorCard;
