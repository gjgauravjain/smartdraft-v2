import { cn } from "@/lib/utils";
import { formatNumber } from "./util";

export function PointsLedgerStatus({
  isMobile,
  isSurplus,
  appliedTotal,
  pointsRequired,
  finalRemaining,
}: {
  isMobile: boolean;
  isSurplus: boolean;
  appliedTotal: number;
  pointsRequired: number;
  finalRemaining: number;
}) {
  return (
    <div
      className={cn(
        "mx-4 mb-4 flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5",
        isMobile && "mx-3.75 mb-3.75 px-3.25 py-2.75",
        isSurplus
          ? "border-success-border bg-success-surface"
          : "border-destructive/30 bg-destructive/10",
      )}
    >
      <div
        className={cn(
          "flex-1 text-[11.5px] tabular-nums",
          isSurplus ? "text-success" : "text-destructive",
        )}
      >
        <strong>{formatNumber(appliedTotal)}</strong> applied{" "}
        <span className="opacity-70">-</span>{" "}
        <strong>{formatNumber(pointsRequired)}</strong> required
      </div>
      <div
        className={cn(
          "whitespace-nowrap text-[13.5px] font-extrabold tabular-nums",
          isSurplus ? "text-success" : "text-destructive",
        )}
      >
        {isSurplus
          ? `Surplus +${formatNumber(Math.abs(finalRemaining))} pts`
          : `Still short ${formatNumber(finalRemaining)} pts`}
      </div>
    </div>
  );
}
