import { cn } from "@/lib/utils";

import { formatNumber } from "./util";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";

export function StatsGrid({ impact }: { impact: FatherSonBidImpactResponse }) {
  const stats = [
    { label: "Required pts", value: formatNumber(impact.pointsRequired) },
    { label: "List spots", value: impact.listSpotsAvailable },
    { label: "Picks used", value: impact.picksUsed },
    {
      label: "Surplus",
      value: impact.draftSurplus,
      positive: impact.draftSurplus >= 0,
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <div className="text-[9.5px] font-extrabold uppercase tracking-wide text-text4">
            {s.label}
          </div>
          <div
            className={cn(
              "mt-1 text-[19px] font-extrabold tabular-nums",
              "positive" in s
                ? s.positive
                  ? "text-success"
                  : "text-destructive"
                : "text-foreground",
            )}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
