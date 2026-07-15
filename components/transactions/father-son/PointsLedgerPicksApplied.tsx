import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LedgerRow } from "./LedgerRow";
import { computeLedgerRows, formatNumber } from "./util";

type LedgerRowType = ReturnType<typeof computeLedgerRows>[number];

export function PointsLedgerPicksApplied({
  rows,
  isMobile,
  calcsVisible,
  onToggleCalcs,
  appliedTotal,
}: {
  rows: LedgerRowType[];
  isMobile: boolean;
  calcsVisible: boolean;
  onToggleCalcs: () => void;
  appliedTotal: number;
}) {
  const compactPicksSummary = rows.map((row, idx) => ({
    label: `Pick ${row.item.overallPick}`,
    value: Number(row.item.aflPointsValue ?? 0),
    isLast: idx === rows.length - 1,
  }));

  return (
    <div className={cn("px-4 py-3.5", isMobile && "px-[15px] pb-3.5 pt-3")}>
      <div className="mb-2.5 flex items-baseline gap-1.5">
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.5px] text-foreground">
          Picks applied
        </span>
        <div className="flex-1" />
        {isMobile && (
          <button
            type="button"
            onClick={onToggleCalcs}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.75 py-[3px] text-[10.5px] font-bold text-muted-foreground"
          >
            <ChevronDown
              className={cn(
                "h-2.5 w-2.5 transition-transform",
                !calcsVisible && "-rotate-90",
              )}
            />
            {calcsVisible ? "Hide calcs" : "Show calcs"}
          </button>
        )}
      </div>

      {isMobile && !calcsVisible ? (
        <div className="flex flex-wrap items-center gap-1.25 rounded-lg border border-border bg-secondary px-3 py-2.25 text-[12px] tabular-nums">
          {compactPicksSummary.length === 0 && (
            <span className="text-muted-foreground">No picks applied.</span>
          )}
          {compactPicksSummary.map((p, idx) => (
            <span key={idx} className="flex items-center gap-1.25">
              <span className="font-bold text-destructive">{p.label}</span>
              <span className="text-[10.5px] text-text4">({formatNumber(p.value)})</span>
              {!p.isLast && (
                <span className="font-bold text-muted-foreground">+</span>
              )}
            </span>
          ))}
          {compactPicksSummary.length > 0 && (
            <>
              <span className="font-bold text-muted-foreground">=</span>
              <span className="text-[12.5px] font-extrabold text-foreground">
                {formatNumber(appliedTotal)} applied
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rows.map((row, idx) => (
            <LedgerRow key={`${row.item.overallPick}-${idx}`} row={row} />
          ))}
          {rows.length === 0 && (
            <div className="text-sm text-muted-foreground">No picks applied.</div>
          )}
        </div>
      )}
    </div>
  );
}
