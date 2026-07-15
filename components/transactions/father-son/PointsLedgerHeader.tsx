import { cn } from "@/lib/utils";
import { formatNumber } from "./util";

export function PointsLedgerHeader({
  pointsRequired,
  isMobile,
}: {
  pointsRequired: number;
  isMobile: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-border px-4 py-3",
        isMobile && "px-3.75 py-3",
      )}
    >
      <div className="whitespace-nowrap text-[10.5px] font-extrabold uppercase tracking-wide text-text4">
        Points ledger
      </div>
      <div className="flex-1" />
      <span className="text-[11px] text-muted-foreground">
        required to match
      </span>
      <span className="text-[15px] font-extrabold tabular-nums text-foreground">
        {formatNumber(pointsRequired)}
      </span>
    </div>
  );
}
