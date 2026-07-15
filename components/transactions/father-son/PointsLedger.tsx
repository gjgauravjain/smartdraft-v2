import { cn } from "@/lib/utils";
import { LedgerRow } from "./LedgerRow";
import { computeLedgerRows, formatNumber } from "./util";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";

export function PointsLedger({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  const rows = computeLedgerRows(impact);
  const finalRemaining = rows.length
    ? rows[rows.length - 1].remaining
    : impact.pointsRequired;
  const isSurplus = finalRemaining <= 0;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="text-[10.5px] font-extrabold uppercase tracking-wide text-text4">
          Points ledger
        </div>
        <div className="flex-1" />
        <span className="text-[11px] text-muted-foreground">
          required to match
        </span>
        <span className="text-[15px] font-extrabold tabular-nums text-foreground">
          {formatNumber(impact.pointsRequired)}
        </span>
      </div>

      <div className="px-4 py-3.5">
        <div className="mb-2.5 text-[10.5px] font-extrabold uppercase tracking-wide text-foreground">
          Picks applied
        </div>
        <div className="flex flex-col gap-1.5">
          {rows.map((row, idx) => (
            <LedgerRow key={`${row.item.overallPick}-${idx}`} row={row} />
          ))}
          {rows.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No picks applied.
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "mx-4 mb-4 flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5",
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
          <strong>
            {formatNumber(impact.pointsRequired - finalRemaining)}
          </strong>{" "}
          applied <span className="opacity-70">of</span>{" "}
          <strong>{formatNumber(impact.pointsRequired)}</strong>
        </div>
        <div
          className={cn(
            "text-[13.5px] font-extrabold tabular-nums",
            isSurplus ? "text-success" : "text-destructive",
          )}
        >
          {isSurplus
            ? `Surplus +${formatNumber(Math.abs(finalRemaining))} pts`
            : `Still short ${formatNumber(finalRemaining)} pts`}
        </div>
      </div>
    </div>
  );
}
