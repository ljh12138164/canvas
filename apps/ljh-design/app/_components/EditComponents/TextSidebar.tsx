import { cn } from "@/app/_lib/utils";
import { Tool, Edit, Font } from "@/app/_types/Edit";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSiderbarClose from "./ToolSiberbarClose";
import ToolSiderbar from "./ToolSiderbar";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActive: (tool: Tool) => void;
}
const TextSidebar = ({
  activeTool,
  onChangeActive,
  editor,
}: TextSidebarProps) => {
  return (
    <aside
      className={cn(
        "z-[100] bg-white  relative transition  h-full flex flex-col",
        activeTool === Tool.Font ? "visible" : "hidden"
      )}
      style={{ flexBasis: "300px" }}
    >
      <ToolSiderbar title="字体" description="插入字体"></ToolSiderbar>
      <ScrollArea>
        <section className=" p-4 border-b space-y-4">
          {Font.map((item) => (
            <Button
              key={item.name}
              className={`w-full py-6`}
              style={{
                height: `${+item.fontSize.slice(0, 2) + 30 + "px"}`,
                fontSize: `${item.fontSize}`,
                fontWeight: `${item.fontWeight}`,
              }}
              variant="outline"
              onClick={() => {
                editor?.addText(item.name, {
                  fontSize: +item.fontSize.slice(0, 2),
                  fontWeight: item.fontWeight,
                });
              }}
            >
              {item.title}
            </Button>
          ))}
        </section>
      </ScrollArea>
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default TextSidebar;
