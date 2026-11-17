"use client";

import { TeamType } from "@/app/api/type/common";

type TradeTeamAddClubProps = {
  teams: TeamType[];
  taken: Set<string>;
  compact?: boolean;
  onAddClub: (teamId: string) => void;
};

export const TradeTeamAddClub = ({
  teams,
  taken,
  compact,
  onAddClub,
}: TradeTeamAddClubProps) => (
  <div
    className={
      compact
        ? "grid min-h-9 place-items-center rounded-[10px] border border-dashed border-border bg-card/40"
        : "row-span-4 grid min-h-16 place-items-center rounded-[10px] border border-dashed border-border bg-card/40"
    }
  >
    <select
      aria-label="Add club"
      value=""
      onChange={(event) => {
        if (event.target.value) onAddClub(event.target.value);
      }}
      className="cursor-pointer appearance-none bg-transparent px-4 py-2 text-center text-xs font-semibold text-primary"
    >
      <option value="">+ Add club</option>
      {teams
        .filter((team) => !taken.has(String(team.id)))
        .map((team) => (
          <option key={team.id} value={String(team.id)}>
            {team.teamNames}
          </option>
        ))}
    </select>
  </div>
);