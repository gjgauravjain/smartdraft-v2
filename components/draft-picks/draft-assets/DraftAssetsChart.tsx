"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { TeamAvatar } from "./TeamAvatar";
import { DraftAssetGraphType, DraftAssetType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import {
  defaultMatchTeam,
  formatPoints,
  totalFor,
  transformDraftAssetGraphData,
  YEAR_COLOR_VARS,
} from "./util";
import { ChartTooltip } from "./ChartTooltip";

type SortDirection = "asc" | "desc";

interface DraftAssetsChartProps {
  data: DraftAssetType[];
  teams: TeamType[];
  matchTeam?: (ownerName: string, team: TeamType) => boolean;
  highlightOwnerName?: string;
  className?: string;
}

function TotalLabel(props: any) {
  const { x, y, width, value } = props;
  if (value === undefined || value === null) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      className="fill-foreground"
      style={{
        fontSize: 11,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatPoints(value as number)}
    </text>
  );
}

function SegmentLabel(props: any) {
  const { x, y, width, height, value } = props;
  if (!value || height < 16) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{
        fontSize: 9,
        fontWeight: 600,
        fill: "white",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {formatPoints(value as number)}
    </text>
  );
}

export function DraftAssetsChart({
  data,
  teams,
  matchTeam = defaultMatchTeam,
  highlightOwnerName,
  className,
}: DraftAssetsChartProps) {
  const [sortDir, setSortDir] = React.useState<SortDirection>("asc");

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

  const chartData = rows.map((r) => r.row);

  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col overflow-hidden p-4",
        className,
      )}
    >
      <div className="mb-2.5 flex shrink-0 items-center gap-3">
        <h1 className="font-heading text-[17px] font-bold text-foreground">
          Draft assets
        </h1>
        <span className="text-[11.5px] text-muted-foreground">
          Points by club across the {years.join(" · ")} drafts
        </span>

        <div className="flex-1" />
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

        <div className="h-4.5 w-px bg-border" />
        <div className="flex items-center gap-3.5">
          {years.map((year, i) => (
            <div key={year} className="flex items-center gap-1.5">
              <span
                className="h-2.75 w-2.75 rounded-sm"
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
      </div>
      <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border border-border bg-card px-2 pb-1 pt-3">
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 24, right: 12, left: 4, bottom: 0 }}
              barCategoryGap="22%"
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeOpacity={0.6}
              />
              <XAxis dataKey="name" hide />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={42}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => formatPoints(v as number)}
              />
              <Tooltip
                cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                content={<ChartTooltip years={years} />}
              />
              {years.map((year, i) => {
                const isTop = i === years.length - 1;
                return (
                  <Bar
                    key={year}
                    dataKey={year}
                    stackId="points"
                    fill={YEAR_COLOR_VARS[i % YEAR_COLOR_VARS.length]}
                    radius={isTop ? [4, 4, 0, 0] : 0}
                    maxBarSize={40}
                  >
                    <LabelList dataKey={year} content={<SegmentLabel />} />
                    {isTop && (
                      <LabelList
                        dataKey={(row: DraftAssetGraphType) =>
                          totalFor(row, years)
                        }
                        content={<TotalLabel />}
                      />
                    )}
                  </Bar>
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-between gap-1 pl-11.5">
          {rows.map(({ row, team }) => {
            const isHighlighted =
              highlightOwnerName &&
              row.name.toLowerCase() === highlightOwnerName.toLowerCase();
            return (
              <div
                key={row.name}
                className="flex flex-1 flex-col items-center gap-0.5"
                title={row.name}
              >
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
                    "text-[8.5px] font-medium",
                    isHighlighted
                      ? "font-bold text-primary"
                      : "text-muted-foreground/70",
                  )}
                >
                  {team?.shortName ?? row.name.slice(0, 3).toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DraftAssetsChart;
