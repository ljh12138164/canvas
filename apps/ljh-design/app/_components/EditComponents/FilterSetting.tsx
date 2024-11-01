interface FilterSettingProps {
  item: string | undefined;
}
const FilterSetting = ({ item }: FilterSettingProps) => {
  if (!item) return;
  return <div>{item}</div>;
};

export default FilterSetting;
