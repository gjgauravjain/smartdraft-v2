"use client";

import { TeamType } from "@/app/api/type/common";
import { clubBadgeClass } from "./util";

export const DraftNightBadge = ({ shortName }: { shortName: string }) => {
  return <span className={clubBadgeClass()}>{shortName}</span>;
};

export const DraftNightClub = ({ team }: { team: TeamType | null }) => {
  if (!team) return null;

  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <DraftNightBadge shortName={team.shortName} />
      <span className="truncate text-[13px] text-foreground">
        {team.teamNames}
      </span>
    </span>
  );
};
