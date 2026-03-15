import { AlertTriangle, ArrowLeftRight, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "checkout" | "return" | "broken";
};

type ActivityTimelineProps = {
  items: Activity[];
};

const itemStyles: Record<Activity["type"], { icon: ComponentType<{ className?: string }>; color: string }> = {
  checkout: { icon: ArrowLeftRight, color: "bg-blue-100 text-blue-700" },
  return: { icon: Wrench, color: "bg-emerald-100 text-emerald-700" },
  broken: { icon: AlertTriangle, color: "bg-rose-100 text-rose-700" },
};

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Naujausiu veiksmu juosta</CardTitle>
        <CardDescription>Naujausi irankiu judejimo ir statuso pokyciu ivykiai.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const style = itemStyles[item.type];
          const Icon = style.icon;

          return (
            <div key={item.id} className="relative flex gap-3 pl-1">
              {index < items.length - 1 ? (
                <span className="absolute left-4 top-10 h-[calc(100%-1.25rem)] w-px bg-slate-200" />
              ) : null}
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", style.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
