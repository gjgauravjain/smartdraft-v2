import { cn } from "@/lib/utils";
import { HandYearRow } from "./HandYearRow";
import { formatSignedPoints } from "./util";
import { TradeImpactTeam } from "@/app/api/type/trade";

export const YearHandCard = ({
  year,
  before,
  after,
  showAllRounds,
}: {
  year: number;
  before: TradeImpactTeam["handBefore"][number];
  after: TradeImpactTeam["handAfter"][number];
  showAllRounds: boolean;
}) => {
  const delta = after.points - before.points;

  return (
    <div className="overflow-hidden rounded-[9px] border border-border bg-muted/60">
      <div className="flex items-baseline gap-2 border-b border-border px-2.5 py-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.6px] text-foreground">
          {year} hand
        </span>
        <span className="flex-1" />
        {delta !== 0 ? (
          <span
            className={cn(
              "text-[10.5px] font-bold tabular-nums",
              delta > 0 ? "text-success" : "text-destructive",
            )}
          >
            {formatSignedPoints(delta)} pts
          </span>
        ) : null}
      </div>
      <HandYearRow year={before} label="Before" showAllRounds={showAllRounds} />
      <HandYearRow
        year={after}
        label="After"
        showAllRounds={showAllRounds}
        highlightIncoming
        bordered
      />
    </div>
  );
};
