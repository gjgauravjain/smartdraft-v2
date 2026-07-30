"use client";

import { FlagTooltipType, YearPickDict } from "@/app/api/type/flags";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function normalizePicks(
  picks: YearPickDict[],
  picksCsv?: string,
): YearPickDict[] {
  if (picks.length > 0) {
    return picks;
  }

  if (!picksCsv) {
    return [];
  }

  return picksCsv
    .split(",")
    .map((pick) => pick.trim())
    .filter(Boolean)
    .map((pick, index) => ({
      pick,
      pickStatus: "",
      clubPickNumber: index + 1,
    }));
}

function getPickClassName(
  pick: YearPickDict,
  rosterSpots: string,
  muted = false,
): string {
  if (muted || !pick.pickStatus) {
    return "border-border bg-muted/60 text-muted-foreground";
  }

  if (pick.pickStatus === "Used") {
    return "border-destructive/40 bg-destructive/10 text-destructive";
  }

  if (pick.clubPickNumber > Number(rosterSpots)) {
    return "border-border bg-muted/60 text-muted-foreground";
  }

  return "border-success-border-muted bg-success-surface-muted text-success-foreground";
}

function YearRow({
  year,
  picks,
  totalPts,
  usablePts,
  rosterSpots,
  mutedPicks = false,
}: {
  year: string;
  picks: YearPickDict[];
  totalPts: number | string;
  usablePts: string;
  rosterSpots: string;
  mutedPicks?: boolean;
}) {
  return (
    <div className="grid grid-cols-[52px_1fr_auto] items-start gap-x-3 gap-y-1.5">
      <span className="pt-0.5 text-xs font-semibold text-foreground">
        {year}
      </span>
      <div className="flex flex-wrap gap-1">
        {picks.map((pick) => (
          <span
            key={`${year}-${pick.pick}`}
            className={cn(
              "inline-flex h-5 min-w-[18px] items-center justify-center rounded border px-1 text-[10px] font-semibold leading-none",
              getPickClassName(pick, rosterSpots, mutedPicks),
            )}
          >
            {pick.pick}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 text-right text-[10px] leading-tight text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">Pts</span> {totalPts}
        </span>
        <span>
          <span className="font-medium text-foreground">Useable</span>{" "}
          {usablePts}
        </span>
      </div>
    </div>
  );
}

export function FlagTooltipContent({
  data,
  teamLogo,
}: {
  data: FlagTooltipType;
  teamLogo: string;
}) {
  const rosterSpots = data.currentYearRosterSpots;

  return (
    <div className="w-[min(90vw,520px)] p-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={teamLogo}
              className="rounded-full"
              alt={data.teamName}
              width={20}
              height={20}
            />
            <p className="text-sm font-semibold text-foreground">
              {data.teamName}
            </p>
          </div>

          {data.picksUsed > 0 && (
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {data.picksUsed} pick{data.picksUsed === 1 ? "" : "s"} used
            </p>
          )}
        </div>
        <div className="rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-right">
          <p className="text-[10px] text-muted-foreground">List spots</p>
          <p className="text-xs font-semibold text-foreground">
            {data.currentYearPickRemaining}
            <span className="font-normal text-muted-foreground">
              {" "}
              / {data.currentYearRosterSpots}
            </span>
          </p>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-3">
        <YearRow
          year={data.currentYear}
          picks={data.currentYearPickDict}
          totalPts={data.currentYearsPts}
          usablePts={data.currentYearPtsRemaining}
          rosterSpots={rosterSpots}
        />

        <YearRow
          year={data.nextYear}
          picks={normalizePicks(data.nextYearPicksDict, data.nextYearPicks)}
          totalPts={data.nextYersPts}
          usablePts={data.nextYearPtsRemaining}
          rosterSpots={rosterSpots}
          mutedPicks
        />

        {data.thirdYear && (
          <YearRow
            year={data.thirdYear}
            picks={normalizePicks(data.thirdYearPicksDict, data.thirdYearPicks)}
            totalPts={data.thirdYearPts}
            usablePts={data.thirdYearPtsRemaining}
            rosterSpots={rosterSpots}
            mutedPicks
          />
        )}
      </div>
    </div>
  );
}
