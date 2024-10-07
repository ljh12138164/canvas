import { cn } from "@/lib/utils";
import type { Edit } from "@/types/Edit";
import { Tool } from "@/types/Edit";

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
        <div className=" p-4 border-b space-y-4">
          <Button className="w-full" onClick={() => editor?.addText("Hello")}>
            添加一个字体盒
          </Button>
          <Button
            className="w-full h-16"
            size="lg"
            variant="secondary"
            onClick={() =>
              editor?.addText("Hello", {
                fontSize: 80,
                fontWeight: "bold",
              })
            }
          >
            <span className="text-3xl font-bold">添加标题</span>
          </Button>
          <Button
            className="w-full h-16"
            size="lg"
            variant="secondary"
            onClick={() =>
              editor?.addText("Hello", {
                fontSize: 32,
              })
            }
          >
            <span className="text-xl font-medium">添加二级标题</span>
          </Button>
          <Button
            className="w-full h-16"
            size="lg"
            variant="secondary"
            onClick={() =>
              editor?.addText("Hello", {
                fontSize: 16,
              })
            }
          >
            添加段落
          </Button>
        </div>
      </ScrollArea>
      <ToolSiderbarClose
        onClose={() => onChangeActive(Tool.Select)}
      ></ToolSiderbarClose>
    </aside>
  );
};

export default TextSidebar;
