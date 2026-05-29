"use client";

import { useState } from "react";

import { DraftYearList, DraftYearType } from "@/app/api/type/draftpicks";
import { DraftRoundColumn } from "@/components/draft-picks/DraftRoundColumn";

type DraftRoundConfig = {
  id: keyof DraftYearType;
  title: string;
};

const DRAFT_ROUNDS: DraftRoundConfig[] = [
  { id: "rd1List", title: "Round 1" },
  { id: "rd2List", title: "Round 2" },
  { id: "rd3List", title: "Round 3" },
  { id: "rd4List", title: "Round 4" },
  { id: "rd5List", title: "Round 5" },
  { id: "rd6List", title: "Rest of Draft" },
];

interface DraftYearPickBoardProps {
  data?: DraftYearType;
  selectedTeamId?: string;
  showAll?: boolean;
  userTeamId?: number | string;
  hoveredTeamId?: number | string | null;
  defaultCollapsedRoundIds?: Array<keyof DraftYearType>;
}

const filterPicks = ({
  picks,
  selectedTeamId,
  showAll,
}: {
  picks: DraftYearList[];
  selectedTeamId?: string;
  showAll?: boolean;
}) => {
  if (showAll || !selectedTeamId) {
    return picks;
  }

  return picks.filter((pick) => Number(pick.teamId) === Number(selectedTeamId));
};

export function DraftYearPickBoard({
  data,
  selectedTeamId,
  showAll,
  userTeamId,
  hoveredTeamId,
  defaultCollapsedRoundIds = ["rd5List", "rd6List"],
}: DraftYearPickBoardProps) {
  const [collapsedRoundIds, setCollapsedRoundIds] = useState<
    Array<keyof DraftYearType>
  >(defaultCollapsedRoundIds);

  const toggleRound = (roundId: keyof DraftYearType) => {
    setCollapsedRoundIds((current) =>
      current.includes(roundId)
        ? current.filter((id) => id !== roundId)
        : [...current, roundId],
    );
  };

  return (
    <div className="w-full overflow-x-auto bg-background p-4">
      <div className="flex min-w-max gap-4">
        {DRAFT_ROUNDS.map((round) => {
          const picks = filterPicks({
            picks: data?.[round.id] ?? [],
            selectedTeamId,
            showAll,
          });

          return (
            <DraftRoundColumn
              key={round.id}
              title={round.title}
              picks={picks}
              collapsed={collapsedRoundIds.includes(round.id)}
              onToggleCollapse={() => toggleRound(round.id)}
              userTeamId={userTeamId}
              hoveredTeamId={hoveredTeamId}
            />
          );
        })}
      </div>
    </div>
  );
}
