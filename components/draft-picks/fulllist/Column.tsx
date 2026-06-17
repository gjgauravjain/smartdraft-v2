import { TeamType } from "@/app/api/type/common";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { SdColumnDef } from "@/components/common/SdTable";
import { cn } from "@/lib/utils";
import ClubDot from "./ClubDot";
import { buildTradeTooltip, hasValue } from "./util";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FullListColumns = (
  teams: TeamType[],
  highlightShortName: string | undefined,
): SdColumnDef<DataFullOrderListType>[] => {
  const teamById = (id?: string) => teams.find((t) => t.id === id);

  const isAccented = (item: DataFullOrderListType) => {
    return !!highlightShortName && item.shortName === highlightShortName;
  };

  return [
    {
      key: "overallPick",
      label: "Pick",
      width: "58px",
      sortable: true,
      sortValue: (r) => parseInt(r.overallPick) || 0,
      render: (item) => (
        <span
          className={cn(
            "text-[12.5px] tabular-nums font-semibold",
            isAccented(item) ? "text-primary dark:text-accent" : "",
          )}
        >
          {item.overallPick}
        </span>
      ),
    },
    {
      key: "shortName",
      label: "Owning club",
      width: "minmax(180px,1.4fr)",
      sortable: true,
      sortValue: (r) => r.shortName ?? "",
      render: (item) => (
        <div className="flex items-center gap-2 min-w-0">
          <ClubDot teams={teams} teamId={item.currentOwner} />
          <span
            className={cn(
              "text-[12.5px] font-semibold",
              isAccented(item) ? "text-primary dark:text-accent" : "",
            )}
          >
            {item.shortName}
          </span>
          <span className="text-[11.5px] text-muted-foreground truncate">
            {item.teamName}
          </span>
        </div>
      ),
    },
    {
      key: "aflPointValue",
      label: "Points / player",
      width: "150px",
      sortable: true,
      sortValue: (r) => parseFloat(r.aflPointValue) || 0,
      render: (item) => {
        if (hasValue(item.selectedPlayer)) {
          const abbr = item.selectedPlayer
            .split(" ")
            .map((p, i) => (i === 0 ? p[0] + "." : p))
            .join(" ");
          return (
            <span
              title={item.selectedPlayer}
              className={cn(
                "inline-block max-w-full text-[11px] font-semibold",
                "px-2 py-0.5 rounded-full truncate",
                "text-success-foreground bg-success-surface-muted border border-success-border-muted",
              )}
            >
              {abbr}
            </span>
          );
        }
        const pts = parseFloat(item.aflPointValue);
        if (hasValue(item.aflPointValue) && !isNaN(pts)) {
          return (
            <span className="text-[12px] tabular-nums text-table-row-text">
              {parseInt(item.aflPointValue).toLocaleString()}
            </span>
          );
        }
        return <span className="text-[12px] text-muted-foreground">—</span>;
      },
    },
    {
      key: "originalOwner",
      label: "Original owner",
      width: "116px",
      render: (item) => {
        if (!hasValue(item.originalOwner)) {
          return <span className="text-[12px] text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <ClubDot teams={teams} teamId={item.originalOwner} />
            <span className="text-[11.5px] font-semibold text-table-row-text">
              {teamById(item.originalOwner)?.shortName}
            </span>
          </div>
        );
      },
    },
    {
      key: "previousOwner",
      label: "Previous owner",
      width: "116px",
      render: (item) => {
        if (!hasValue(item.previousOwner)) {
          return <span className="text-[12px] text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <ClubDot teams={teams} teamId={item.previousOwner} />
            <span className="text-[11.5px] font-semibold text-table-row-text">
              {teamById(item.previousOwner)?.shortName}
            </span>
          </div>
        );
      },
    },
    {
      key: "reason",
      label: "Reason",
      width: "minmax(140px,1fr)",
      sortable: true,
      sortValue: (r) => r.reason ?? "",
      render: (item) => {
        if (!hasValue(item.reason)) {
          return <span className="text-[12px] text-muted-foreground">—</span>;
        }
        const tooltip = buildTradeTooltip(item);
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn(
                "text-[10.5px] font-semibold px-2 py-0.5 rounded-full truncate max-w-full",
                "text-table-row-text bg-table-header border border-border",
              )}
            >
              {item.reason}
            </span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex items-center justify-center shrink-0 cursor-help",
                      "w-3.25 h-3.25 rounded-full",
                      "border border-muted-foreground text-muted-foreground",
                      "text-[9px] font-extrabold italic",
                      "font-[serif] leading-none",
                    )}
                  >
                    i
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="text-xs max-w-55 whitespace-pre-line"
                >
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
};
