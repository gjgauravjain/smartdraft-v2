"use client";

import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { DraftPoolPlayer } from "@/app/api/type/player";
import { cn } from "@/lib/utils";
import { DraftNightClub } from "./DraftNightClub";
import { fieldLabelClass, pickChipClass, summaryArrowClass, summaryGridClass, teamForOwner } from "./util";

type DraftNightSummaryProps = {
  isMobile: boolean;
  pick: DraftPicksDataType | null;
  player: DraftPoolPlayer | null;
  teams: TeamType[];
};

export const DraftNightSummary = ({
  isMobile,
  pick,
  player,
  teams,
}: DraftNightSummaryProps) => {
  if (!pick || !player) return null;

  const team = teamForOwner(teams, pick.currentOwner);

  return (
    <div
      className={cn(
        "rounded-[10px] border border-border bg-muted px-3.5 py-3",
        summaryGridClass(isMobile),
      )}
    >
      <div>
        <span className={fieldLabelClass()}>Pick</span>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={pickChipClass(false)}>{pick.display}</span>
          <DraftNightClub team={team} />
        </div>
      </div>
      <span className={summaryArrowClass(isMobile)} aria-hidden="true">
        →
      </span>
      <div>
        <span className={fieldLabelClass()}>Player</span>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold text-foreground">{player.displayName}</span>
          {player.position ? (
            <span className="text-[11.5px] text-muted-foreground">
              {player.position}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
