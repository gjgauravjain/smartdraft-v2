import { TradeImpactTeam } from "@/app/api/type/trade";
import { formatPoints } from "./util";
import { cn } from "@/lib/utils";

export const HandYearRow = ({
  year,
  label,
  showAllRounds,
  highlightIncoming = false,
  bordered = false,
}: {
  year: TradeImpactTeam["handBefore"][number];
  label: string;
  showAllRounds: boolean;
  highlightIncoming?: boolean;
  bordered?: boolean;
}) => {
  const picks = showAllRounds
    ? year.picks
    : year.picks.filter((pick) => pick.round <= 6);

  return (
    <div
      className={cn(
        "grid grid-cols-[44px_minmax(0,1fr)_auto] items-start gap-2.5 px-2.5 py-2",
        bordered && "border-t border-border",
      )}
    >
      <span className="pt-1 text-[9.5px] font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap gap-1.5 overflow-hidden">
        {picks.map((pick) => {
          const incoming = highlightIncoming && pick.incoming;
          return (
            <span
              key={`${year.year}-${pick.pick}`}
              className={cn(
                "inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 rounded-full px-[9px] text-[11px] font-bold tabular-nums",
                incoming
                  ? "border border-highlight-text bg-highlight-text text-white"
                  : "border border-border bg-card text-foreground",
              )}
            >
              {incoming ? (
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-white" />
              ) : null}
              <span className="min-w-0 truncate">{pick.pickName}</span>
              {incoming ? (
                <span className="shrink-0 text-[9px] font-semibold opacity-[0.78]">
                  in
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <span className="shrink-0 whitespace-nowrap pt-1 text-[10.5px] font-bold tabular-nums text-muted-foreground">
        {formatPoints(year.points)} pts
      </span>
    </div>
  );
};
