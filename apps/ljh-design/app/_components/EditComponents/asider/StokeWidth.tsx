import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Slider } from '@/app/_components/ui/slider';
import type { Edit } from '@/app/_types/Edit';
import { STROKE_WIDTH } from '@/app/_types/Edit';
interface StokeWidthProps {
  editor: Edit | undefined;
}
const StokeWidth = ({ editor }: StokeWidthProps) => {
  const stokeWidth = editor?.getActiveStrokeWidth() ?? STROKE_WIDTH;
  return (
    <>
      <Label className="text-sm">边框宽度</Label>
      <Slider
        value={[stokeWidth]}
        min={0.1}
        max={10}
        step={0.01}
        onValueChange={(values) => {
          editor?.setStrokeWidth(values[0]);
        }}
      />
      <section className="p-4a space-y-4 border-b">
        <Label className="text-sm">边框类型</Label>
        <Button
          onClick={() => editor?.changeStokeDashArray([])}
          variant="secondary"
          size="lg"
          className={`w-full h-16 justify-start text-left px-2 py-4 ${JSON.stringify(editor?.getActiveStokeDashArray()) === '[]' && 'border-blue-500 border'}`}
        >
          <div className="w-full border-black rounded-full border-4 " />
        </Button>
        <Button
          onClick={() => editor?.changeStokeDashArray([2, 2])}
          variant="secondary"
          size="lg"
          className={`w-full h-16 justify-start text-left px-2 py-4 ${JSON.stringify(editor?.getActiveStokeDashArray()) === '[2,2]' && 'border-blue-500 border'}`}
        >
          <div className="w-full border-black rounded-full border-4 border-dashed" />
        </Button>
      </section>
    </>
  );
};

export default StokeWidth;
