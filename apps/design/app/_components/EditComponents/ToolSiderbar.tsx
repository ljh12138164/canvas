interface ToolSiderbarProps {
  title: string;
  description?: string;
}
const ToolSiderbar = ({ title, description }: ToolSiderbarProps) => {
  return (
    <div className="w-full border-b p-4 space-y-1 h-[60px] group border-r border-y px-1 pr-2 rounded-r-xl transform  bg-white flex items-center justify-center">
      <p className="text-sm font-medium"> {title}</p>
      {description && (
        <p className=" text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default ToolSiderbar;
