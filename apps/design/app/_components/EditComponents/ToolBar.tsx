import { Edit, Tool } from "@/types/Edit";

interface ToolBarProps {
  editor: Edit | undefined;
  activeTool: Tool;
  onChangeActiveTool: (tool: Tool) => void;
}
const ToolBar = ({ editor, activeTool, onChangeActiveTool }: ToolBarProps) => {
  // const selectedObject = editor?.canvas?.getActiveObject();
  // //获取属性
  // const getProperty = (property: any) => {
  //   if (!selectedObject) return null;
  //   return selectedObject.get(property);
  // };
  // const fillProperty = getProperty("fill");

  // const [properties, setProperties] = useState();
  return (
    <section className="flex border-b items-center p-2 gap-x-2 overflow-x-auto z-50 bg-white shrink-0 h-[3rem] w-full">
      22 000000
    </section>
  );
};

export default ToolBar;
