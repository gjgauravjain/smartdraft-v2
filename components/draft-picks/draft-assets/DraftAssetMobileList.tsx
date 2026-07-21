"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DraftAssetType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import {
  defaultMatchTeam,
  totalFor,
  transformDraftAssetGraphData,
  YEAR_COLOR_VARS,
} from "./util";
import { TeamRow } from "./TeamRow";

type SortDirection = "asc" | "desc";

interface DraftAssetsMobileListProps {
  data: DraftAssetType[];
  teams: TeamType[];
  matchTeam?: (ownerName: string, team: TeamType) => boolean;
  highlightOwnerName?: string;
  className?: string;
}

export function DraftAssetsMobileList({
  data,
  teams,
  matchTeam = defaultMatchTeam,
  highlightOwnerName,
  className,
}: DraftAssetsMobileListProps) {
  const [sortDir, setSortDir] = React.useState<SortDirection>("desc");

  const years = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.year))).sort(),
    [data],
  );

  const rows = React.useMemo(() => {
    const grouped = transformDraftAssetGraphData(data);
    const withTotals = grouped.map((row) => ({
      row,
      total: totalFor(row, years),
      team: teams.find((t) => matchTeam(row.name, t)),
    }));
    withTotals.sort((a, b) =>
      sortDir === "asc" ? a.total - b.total : b.total - a.total,
    );
    return withTotals;
  }, [data, teams, years, sortDir, matchTeam]);

  const maxTotal = React.useMemo(
    () => Math.max(...rows.map((r) => r.total), 0),
    [rows],
  );

  return (
    <div className={cn("flex flex-col font-sans", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 pb-2 pt-3">
        <div className="flex items-center gap-3.5">
          {years.map((year, i) => (
            <div key={year} className="flex items-center gap-1.5">
              <span
                className="h-[11px] w-[11px] rounded-sm"
                style={{
                  background: YEAR_COLOR_VARS[i % YEAR_COLOR_VARS.length],
                }}
              />
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {year}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-muted-foreground/70">
            Sort
          </span>
          <div className="flex gap-0.5 rounded-md border border-border bg-muted/60 p-0.5">
            <button
              type="button"
              onClick={() => setSortDir("asc")}
              className={cn(
                "rounded-sm px-2.5 py-1 text-[10.5px] font-semibold transition-colors",
                sortDir === "asc"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Low → High
            </button>
            <button
              type="button"
              onClick={() => setSortDir("desc")}
              className={cn(
                "rounded-sm px-2.5 py-1 text-[10.5px] font-semibold transition-colors",
                sortDir === "desc"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              High → Low
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-3.5 pt-1 h-screen pb-150 overflow-auto">
        {rows.map(({ row, team, total }) => (
          <TeamRow
            key={row.name}
            row={row}
            team={team}
            years={years}
            total={total}
            maxTotal={maxTotal}
            isHighlighted={
              !!highlightOwnerName &&
              row.name.toLowerCase() === highlightOwnerName.toLowerCase()
            }
          />
        ))}
      </div>
    </div>
  );
}

export default DraftAssetsMobileList;
