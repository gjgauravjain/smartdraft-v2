import { TeamType } from "@/app/api/type/common";
import { DraftAssetGraphType } from "@/app/api/type/draftpicks";
import { TeamAvatar } from "./TeamAvatar";
import { cn } from "@/lib/utils";
import { formatPoints, MIN_LABEL_WIDTH_PCT, YEAR_COLOR_VARS } from "./util";

interface TeamRowProps {
  row: DraftAssetGraphType;
  team?: TeamType;
  years: string[];
  total: number;
  isHighlighted: boolean;
}

export function TeamRow({
  row,
  team,
  years,
  total,
  isHighlighted,
}: TeamRowProps) {
  return (
    <div className="font-sans">
      <div className="mb-[5px] flex items-center gap-2">
        <div
          className={cn(
            "rounded-full border-2 p-[1.5px]",
            isHighlighted ? "border-primary" : "border-transparent",
          )}
        >
          <TeamAvatar team={team} />
        </div>
        <span
          className={cn(
            "text-[12.5px] font-semibold",
            isHighlighted ? "text-primary" : "text-foreground",
          )}
        >
          {team?.shortName ?? row.name.slice(0, 3).toUpperCase()}
        </span>
        <span className="flex-1 truncate text-[11px] text-muted-foreground/70">
          {team?.teamNames ?? row.name}
        </span>
        <span className="text-[12px] font-bold tabular-nums text-foreground">
          {formatPoints(total)}
        </span>
      </div>

      <div
        className={cn(
          "flex h-[22px] overflow-hidden rounded-md bg-muted",
          isHighlighted &&
            "outline outline-[1.5px] -outline-offset-[1.5px] outline-primary",
        )}
      >
        {years.map((year, i) => {
          const value = row[year];
          if (typeof value !== "number" || value <= 0 || total === 0)
            return null;
          const pct = (value / total) * 100;
          return (
            <div
              key={year}
              className="flex items-center overflow-hidden pl-1.5"
              style={{
                width: `${pct}%`,
                background: YEAR_COLOR_VARS[i % YEAR_COLOR_VARS.length],
              }}
            >
              {pct >= MIN_LABEL_WIDTH_PCT && (
                <span className="whitespace-nowrap text-[9.5px] font-semibold tabular-nums text-white">
                  {formatPoints(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
