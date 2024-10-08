import { FaMinus, FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}
const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {
  return (
    <div className="flex items-center">
      <Button>
        <FaMinus className="size-4" />
      </Button>
      <Input></Input>
      <Button>
        <FaPlus className="size-4" />
      </Button>
    </div>
  );
};

export default FontSizeInput;
