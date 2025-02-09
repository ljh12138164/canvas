import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Slider } from '@/app/_components/ui/slider';
import type { Edit } from '@/app/_types/Edit';
import { DASH_TYPES, STROKE_WIDTH } from '@/app/_types/Edit';
import { Separator } from '../../ui/separator';
interface StokeWidthProps {
  editor: Edit | undefined;
}
const StokeWidth = ({ editor }: StokeWidthProps) => {
  const stokeWidth = editor?.getActiveStrokeWidth() ?? STROKE_WIDTH;
  return (
    <>
      <Label className="text-xl">边框宽度</Label>
      <Slider
        value={[stokeWidth]}
        min={0.1}
        max={10}
        step={0.01}
        onValueChange={(values) => {
          editor?.setStrokeWidth(values[0]);
        }}
      />
      <Separator className="my-4" />
      <section className="p-4a space-y-4 border-b">
        <Label className="text-xl">边框类型</Label>
        {Object.entries(DASH_TYPES).map(([key, value]) => {
          return (
            <div key={key}>
              <h4>{key}</h4>
              <button
                type="button"
                onClick={() => editor?.changeStokeDashArray(value)}
                className={`w-[268px] h-16 justify-start text-left px-2 hover:bg-gray-100 dark:hover:bg-background transition-all duration-100 ease-in-out rounded-sm py-4 ${
                  JSON.stringify(editor?.getActiveStokeDashArray()) === JSON.stringify(value) &&
                  'border-blue-500 border'
                }`}
              >
                <div className="w-[250px]  h-8 flex items-center overflow-hidden">
                  <svg width="250px" height="2" preserveAspectRatio="none">
                    <title>{key}</title>
                    <line
                      x1="0"
                      y1="1"
                      x2="100%"
                      y2="1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={(() => {
                        if (value.length === 0) return 'none';
                        // 根据不同类型设置不同的虚线模式
                        switch (key) {
                          case '点线':
                            return '1 8';
                          case '虚线':
                            return '8 8';
                          case '点划线':
                            return '12 6 1 6';
                          case '双虚线':
                            return '16 4 8 4';
                          case '长虚线':
                            return '20 8';
                          case '密集虚线':
                            return '4 4';
                          default:
                            return 'none';
                        }
                      })()}
                    />
                  </svg>
                </div>
              </button>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default StokeWidth;
