"use client";

import { ApplyCompensationPick } from "@/app/api/type/apply-compensation";
import { TeamType } from "@/app/api/type/common";
import { clubBadgeClass, pickBoxClass, teamShortName } from "./util";

type ApplyCompensationRowProps = {
  pick: ApplyCompensationPick;
  teams: TeamType[];
};

export const ApplyCompensationRow = ({
  pick,
  teams,
}: ApplyCompensationRowProps) => {
  const shortName = teamShortName(teams, pick.teamId);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="inline-flex min-w-0 flex-wrap items-center gap-1.5 font-semibold text-foreground">
          {shortName ? (
            <span className={clubBadgeClass()}>{shortName}</span>
          ) : null}
          <span>{pick.teamName}</span>
        </span>
        {pick.label ? (
          <span className="text-[13px] text-foreground">{pick.label}</span>
        ) : null}
        {pick.slideSummary ? (
          <span className="text-[11.5px] leading-normal text-muted-foreground">
            {pick.slideSummary}
          </span>
        ) : null}
        {pick.removedPicks.map((removed, index) => (
          <span
            key={`${removed}-${index}`}
            className="text-[11.5px] leading-normal text-muted-foreground/80"
          >
            Removes {removed}
          </span>
        ))}
      </div>
      {pick.overallPick !== null ? (
        <span className={pickBoxClass()}>Pick {pick.overallPick}</span>
      ) : null}
    </div>
  );
};
