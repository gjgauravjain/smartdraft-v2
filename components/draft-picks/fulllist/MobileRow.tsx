import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ClubDot from "./ClubDot";
import { isAdjusted, hasValue, buildTradeTooltip } from "./util";

type Props = {
  item: DataFullOrderListType;
  teams: TeamType[];
  isAccented: boolean;
};

const MobileRow = ({ item, teams, isAccented }: Props) => {
  const adjusted = isAdjusted(item);
  const teamById = (id?: string) =>
    teams.find((t) => t.id.toString() === id?.toString());
  const tooltip = buildTradeTooltip(item);

  const hasPlayer = hasValue(item.selectedPlayer);
  const hasPoints =
    hasValue(item.aflPointValue) && !isNaN(parseFloat(item.aflPointValue));
  const hasOriginal = hasValue(item.originalOwner);
  const hasPrevious = hasValue(item.previousOwner);
  const hasReason = hasValue(item.reason);

  const abbr = hasPlayer
    ? item.selectedPlayer
        .split(" ")
        .map((p, i) => (i === 0 ? p[0] + "." : p))
        .join(" ")
    : null;

  const originalShort = teamById(item.originalOwner)?.shortName;
  const previousShort = teamById(item.previousOwner)?.shortName;

  return (
    <div
      className={cn(
        "flex items-center gap-[9px] min-h-[46px] box-border px-[14px] py-[7px]",
        "border-t border-table-row-border font-sans transition-colors",
        isAccented && "bg-primary-light",
        !isAccented &&
          adjusted &&
          "bg-table-row-hover shadow-[3px_0_0_var(--table-row-text)_inset]",
      )}
    >
      {/* Pick number */}
      <div
        className={cn(
          "w-6 text-[13px] font-bold tabular-nums shrink-0",
          isAccented ? "text-primary dark:text-accent" : "text-foreground",
        )}
      >
        {item.overallPick}
      </div>

      {/* Club dot */}
      <ClubDot teams={teams} teamId={item.currentOwner ?? item.shortName} />

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Top row: club name + info icon */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-[12.5px] font-semibold",
              isAccented ? "text-primary dark:text-accent" : "text-foreground",
              adjusted && !isAccented && "font-bold",
            )}
          >
            {item.shortName}
          </span>

          {hasReason && tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "inline-flex items-center justify-center shrink-0 cursor-help",
                    "w-[13px] h-[13px] rounded-full leading-none",
                    "border border-muted-foreground text-muted-foreground",
                    "text-[9px] font-extrabold italic [font-family:serif]",
                  )}
                >
                  i
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="text-xs max-w-[200px] whitespace-pre-line"
              >
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Bottom row: reason + trade chain */}
        {hasReason && (
          <div className="flex items-center gap-[5px] mt-0.5 text-[10.5px] text-muted-foreground">
            <span className="font-semibold">{item.reason}</span>

            {(hasOriginal || hasPrevious) && (
              <>
                <span className="text-muted-foreground/50">·</span>
                {hasOriginal && (
                  <div className="flex items-center gap-1">
                    <ClubDot teams={teams} teamId={item.originalOwner} />
                    <span>
                      {originalShort}
                      {hasPrevious && previousShort !== originalShort
                        ? ` → ${previousShort}`
                        : ""}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: player badge or points */}
      {hasPlayer ? (
        <span
          title={item.selectedPlayer}
          className={cn(
            "text-[11px] font-semibold px-[9px] py-0.5 rounded-full whitespace-nowrap shrink-0",
            "text-success-foreground bg-success-surface-muted border border-success-border-muted",
          )}
        >
          {abbr}
        </span>
      ) : hasPoints ? (
        <span className="text-[11.5px] text-muted-foreground tabular-nums shrink-0">
          {parseInt(item.aflPointValue).toLocaleString()} pts
        </span>
      ) : null}
    </div>
  );
};

export default MobileRow;
