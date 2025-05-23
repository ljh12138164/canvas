import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface TiptapToolbar {
  tiptapToolBar: {
    key: string;
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    active: boolean;
    disabled: boolean;
  }[];
}

const TiptapToolbar = ({ tiptapToolBar }: TiptapToolbar) => {
  return (
    <div className="flex border ">
      {tiptapToolBar.map((item) => (
        <div key={item.key} className="flex items-center h-full gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  key={item.key + item.title}
                  variant="ghost"
                  aria-label="取消"
                  type="button"
                  onClick={item.onClick}
                  disabled={!item.disabled}
                  className={`p-0 h-8 w-12 rounded-none ${
                    item.active
                      ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
};

export default TiptapToolbar;
