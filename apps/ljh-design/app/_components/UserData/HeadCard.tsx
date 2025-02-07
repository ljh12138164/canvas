import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
interface HeadCardProps {
  data: {
    total: number;
    title: string;
  }[];
}
export default function HeadCard({ data }: HeadCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.total}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
