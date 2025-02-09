import { AreaChart, type AreaChartType } from '../AdminEchart/AreaChart';
import { LegendChart } from '../AdminEchart/LegendChart';
import { LineCharts } from '../AdminEchart/LineCharts';
interface EchartContentProps {
  startTime: Date | undefined;
  endTime: Date | undefined;
  genData: Record<AreaChartType | 'date', number | string>[];
  label: string;
}

const EchartContent = ({ startTime, endTime, genData, label }: EchartContentProps) => {
  return (
    <div className="flex flex-col gap-4">
      <AreaChart startTime={startTime} endTime={endTime} genData={genData} label={label} />
      <LineCharts startTime={startTime} endTime={endTime} genData={genData} label={label} />
      <LegendChart startTime={startTime} endTime={endTime} genData={genData} />
    </div>
  );
};

export default EchartContent;
