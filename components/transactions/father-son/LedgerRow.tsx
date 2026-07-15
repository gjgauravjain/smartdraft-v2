import { cn } from "@/lib/utils";
import { computeLedgerRows, formatNumber } from "./util";

export function LedgerRow({
  row,
}: {
  row: ReturnType<typeof computeLedgerRows>[number];
}) {
  const { item, pickValue, owedBefore, remaining, isLost, isShuffled } = row;
  const surplus = remaining < 0 ? Math.abs(remaining) : 0;

  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            isLost ? "bg-destructive" : "bg-muted-foreground",
          )}
        />
        <span className="flex-1 text-[13px] font-bold text-foreground">
          Pick {item.overallPick}
        </span>
        {isLost && (
          <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
            pick lost
          </span>
        )}
        {isShuffled && (
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            slides → Pick {item.newPickNo}
          </span>
        )}
        {!isLost && !isShuffled && (
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            {item.action}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-4 text-[13px] tabular-nums">
        <span className="font-bold text-muted-foreground">
          {formatNumber(owedBefore)}
        </span>
        <span className="text-[9.5px] text-text4">owed</span>
        <span className="font-bold text-muted-foreground">−</span>
        <span className="font-extrabold text-destructive">
          {formatNumber(pickValue)}
        </span>
        <span className="text-[9.5px] text-text4">pick value</span>
        <span className="font-bold text-muted-foreground">=</span>
        {surplus > 0 ? (
          <>
            <span className="font-extrabold text-success">0 owed</span>
            <span className="text-[10px] font-bold text-success">
              · +{formatNumber(surplus)} surplus
            </span>
          </>
        ) : (
          <span className="font-extrabold text-foreground">
            {formatNumber(remaining)} still owed
          </span>
        )}
      </div>
    </div>
  );
}
