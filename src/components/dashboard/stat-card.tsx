import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number;
  trend: string;
  tone: "slate" | "emerald" | "amber" | "rose";
};

const toneClasses: Record<StatCardProps["tone"], string> = {
  slate: "from-slate-900 to-slate-700",
  emerald: "from-emerald-700 to-emerald-500",
  amber: "from-amber-700 to-amber-500",
  rose: "from-rose-700 to-rose-500",
};

export function StatCard({ title, value, trend, tone }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all hover:-translate-y-0.5">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneClasses[tone]}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[2rem]">{value}</p>
        <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}
