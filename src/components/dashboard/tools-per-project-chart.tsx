import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectPoint = {
  project: string;
  count: number;
};

type ToolsPerProjectChartProps = {
  data: ProjectPoint[];
};

export function ToolsPerProjectChart({ data }: ToolsPerProjectChartProps) {
  const maxValue = Math.max(...data.map((item) => item.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Tools per Project</CardTitle>
        <CardDescription>Current inventory distribution across active projects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const width = `${(item.count / maxValue) * 100}%`;
          return (
            <div key={item.project} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{item.project}</span>
                <span className="text-slate-500">{item.count}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 transition-all"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
