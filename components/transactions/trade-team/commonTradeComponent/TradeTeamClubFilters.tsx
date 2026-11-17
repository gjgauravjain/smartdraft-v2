"use client";

import { TeamType } from "@/app/api/type/common";
import { TradeTeamFilterChip } from "./TradeTeamFilterChip";

type TradeTeamClubFiltersProps = {
  label: string;
  clubs: TeamType[];
  activeClubId: string;
  onClub: (clubId: string) => void;
};

export const TradeTeamClubFilters = ({
  label,
  clubs,
  activeClubId,
  onClub,
}: TradeTeamClubFiltersProps) => {
  if (!clubs.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 px-4 pt-2.5 sm:px-5">
      <span className="w-full text-[10px] font-bold tracking-wide text-muted-foreground uppercase sm:w-20 sm:leading-6.5">
        {label}
      </span>
      {clubs.map((team) => (
        <TradeTeamFilterChip
          key={team.id}
          label={team.shortName}
          selected={String(team.id) === String(activeClubId)}
          onClick={() => onClub(String(team.id))}
        />
      ))}
    </div>
  );
};