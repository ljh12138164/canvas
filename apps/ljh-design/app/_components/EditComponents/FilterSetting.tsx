import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Separator } from "@/app/_components/ui/separator";
import { Slider } from "@/app/_components/ui/slider";
import {
  CanfilterSetting,
  CheckboxProps,
  ColorFilterProps,
  Edit,
  OptionFilterProps,
  SiderProps,
} from "@/app/_types/Edit";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";

import { useForm } from "react-hook-form";
interface FilterSettingProps {
  editor: Edit | undefined;
  filterSetting: string;
}

const FilterSetting = ({ editor, filterSetting }: FilterSettingProps) => {
  const filter = CanfilterSetting.find((items) => items.name === filterSetting);
  const effect = editor?.getActiveFilterEffect(filterSetting);
  const { register, getValues, setValue } = useForm<
    Record<string, number | boolean | string>
  >({
    defaultValues: {
      ...effect,
    },
  });
  // 初始化颜色
  // @ts-ignore
  const [color, setColor] = useState<string>(effect?.color || "#000");
  const defalutValue = (
    item: SiderProps | CheckboxProps | ColorFilterProps | OptionFilterProps,
    index: number | undefined
  ) => {
    if (index === undefined)
      // @ts-ignore
      return [effect[item?.id]];
    // @ts-ignore
    return [effect[item.id][index]];
  };
  useEffect(() => {}, [getValues]);
  const getFilterValue = () => {
    // @ts-ignore
    const arr = filter.change.map((item) => {
      return { [item.name]: getValues(item.name) };
    });
    return arr.reduce((a, b) => ({ ...a, ...b }), {});
  };
  const handleChange = () => {
    if (!filter) return null;

    const value = getFilterValue();
    const start = Object.keys(value)[0].slice(0, -1);
    if (Object.keys(value).every((item) => item.slice(0, -1) === start)) {
      editor?.changeImageFilterSetting(
        filter?.name,
        // @ts-ignore
        filter?.multiply({
          [start]: Object.values(value).map((item) => +item),
        })
      );
    } else {
      // @ts-ignore
      editor?.changeImageFilterSetting(filter.name, filter?.multiply(value));
    }
  };
  return (
    <form>
      <p className="text-xl font-[600] mb-3">{filter?.title}</p>
      {filter?.change.length === 1 && filter?.change[0].type === "slider" && (
        <Slider
          key={filter?.change[0].id}
          step={filter.change[0].step}
          min={filter.change[0].min}
          max={filter.change[0].max}
          defaultValue={defalutValue(filter?.change[0], filter.change[0].index)}
          onValueChange={(value) => {
            editor?.changeImageFilterSetting(
              filter.name,
              // @ts-ignore
              filter?.change?.[0]?.value(value[0])
            );
          }}
        ></Slider>
      )}
      {filter?.change.length === 1 && filter?.change[0].type === "option" && (
        <Select
          onValueChange={(value: string) => {
            editor?.changeImageFilterSetting(
              filter.name,
              // @ts-ignore
              filter?.change?.[0]?.value(value)
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择模式" />
          </SelectTrigger>
          <SelectContent className="z-[9999999999]">
            <SelectGroup>
              <SelectLabel>选择模式</SelectLabel>
              {filter?.change[0].options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      <div className="flex flex-col gap-2">
        {/* @ts-ignore */}
        {filter?.change?.length > 1 &&
          filter?.change.map((item, index) => {
            return (
              <div key={index} className="flex flex-col gap-2">
                <Label className="text-sm" id={item.id}>
                  {item.title}
                </Label>
                {item.type === "slider" && (
                  <Slider
                    key={index}
                    step={item.step}
                    // @ts-ignore
                    min={item.min as number}
                    // @ts-ignore
                    max={item.max as number}
                    {...register(item.name)}
                    defaultValue={defalutValue(item, item.index)}
                    onValueChange={(value) => {
                      setValue(item.id, value[0]);
                      handleChange();
                    }}
                  ></Slider>
                )}
                {item.type === "checkbox" && (
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    key={index}
                    {...register(item.name)}
                    //@ts-ignore
                    defaultValue={effect?.[item.id]}
                    onChange={(e) => {
                      setValue(item.name, e.target.checked);
                      handleChange();
                    }}
                  ></input>
                )}
                {item.type === "color" && (
                  <ChromePicker
                    color={color}
                    className="border rounded-lg"
                    onChange={(color) => {
                      handleChange();
                      setValue(item.name, color.hex);
                      setColor(color.hex);
                    }}
                  />
                )}
                {item.type === "option" && (
                  <Select
                    {...register(item.name)}
                    onValueChange={(value: string) => {
                      setValue(item.name, value);
                      handleChange();
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择模式" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999999999]">
                      <SelectGroup>
                        <SelectLabel>选择模式</SelectLabel>
                        {item.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                <Separator className="my-2"></Separator>
              </div>
            );
          })}
      </div>
    </form>
  );
};

export default FilterSetting;
