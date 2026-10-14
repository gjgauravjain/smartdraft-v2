import { cn } from "@/lib/utils";

import { formatNumber } from "./util";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";

export function StatsGrid({ impact }: { impact: FatherSonBidImpactResponse }) {
  const stats = [
    {
      label: "Required pts",
      subtitle: "to match the bid",
      value: formatNumber(impact.pointsRequired),
    },
    {
      label: "List spots",
      subtitle: "start of draft",
      value: impact.listSpotsAvailable,
    },
    {
      label: "Used so far",
      subtitle: `this draft · ${impact.picksAvailable} left`,
      value: impact.picksUsed,
    },
    {
      label: "Surplus",
      subtitle: "points left over",
      value: impact.draftSurplus,
      positive: impact.draftSurplus >= 0,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
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
              "mt-1 text-[17px] font-extrabold tabular-nums",
              "positive" in s
                ? s.positive
                  ? "text-success"
                  : "text-destructive"
                : "text-foreground",
            )}
          >
            {s.value}
          </div>
          <div className="text-[10.5px] text-text4 mt-1">
            {s.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
}
