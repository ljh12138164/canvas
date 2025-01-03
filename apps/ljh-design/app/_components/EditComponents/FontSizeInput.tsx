import { FaMinus, FaPlus } from "react-icons/fa6";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Edit } from "@/app/_types/Edit";
interface FontSizeInputProps {
  editor: Edit | undefined;
}
const FontSizeInput = ({ editor }: FontSizeInputProps) => {
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className="p-2 rounded-r-none broder-r-0 w-8 h-8"
        size="icon"
        onClick={() => editor?.changeFontSize(editor?.getActiveFontSize() - 2)}
      >
        <FaMinus className="size-4" />
      </Button>
      <Input
        value={editor?.getActiveFontSize()}
        onChange={(e) => {
          editor?.changeFontSize(parseInt(e.target.value, 10));
        }}
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
      ></Input>
      <Button
        variant="outline"
        className="p-2 rounded-l-none broder-l-0  w-8 h-8"
        size="icon"
        onClick={() => editor?.changeFontSize(editor?.getActiveFontSize() + 2)}
      >
        <FaPlus className="size-4" />
      </Button>
    </div>
  );
};

export default FontSizeInput;
