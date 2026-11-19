import { cn } from "@/lib/utils";
import { BidMatchResult } from "./type";
import { costRowClass } from "./util";

type BidMatchCostProps = {
  result: BidMatchResult;
};

export const BidMatchCost = ({ result }: BidMatchCostProps) => {
  if (!result.cost.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-2 border-b border-border bg-muted/50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <span>Cost</span>
        <span className="text-right">Points</span>
        <span className="text-right">Remaining</span>
      </div>
      {result.cost.map((row) => (
        <div
          key={row.key}
          className={cn(
            "grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-2 border-b border-border px-3 py-2 text-xs last:border-b-0",
            costRowClass(row.tone),
          )}
        >
          <span className="min-w-0">
            <span className="block font-medium">{row.label}</span>
            {row.detail ? (
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                {row.detail}
              </span>
            ) : null}
          </span>
          <span className="text-right tabular-nums">{row.points}</span>
          <span className="text-right tabular-nums">{row.remaining}</span>
        </div>
      ))}
    </div>
  );
};
