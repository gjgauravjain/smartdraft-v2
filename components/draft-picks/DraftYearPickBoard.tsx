"use client";

import { useEffect } from "react";
import { DraftYearType } from "@/app/api/type/draftpicks";
import { DraftRoundColumn } from "@/components/draft-picks/DraftRoundColumn";
import { DraftRoundTabBar } from "@/components/draft-picks/DraftRoundTabBar";
import { DraftRoundMobileList } from "@/components/draft-picks/DraftRoundMobileList";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRowHeight } from "./hook";
import { DRAFT_ROUNDS, filterPicks } from "./util";
import { useState } from "react";

interface DraftYearPickBoardProps {
  data?: DraftYearType;
  selectedTeamId?: string;
  showAll?: boolean;
  userTeamId?: number | string;
  hoveredTeamId?: number | string | null;
  defaultCollapsedRoundIds?: Array<keyof DraftYearType>;
  visibleRoundIds?: Array<keyof DraftYearType>;
}

export function DraftYearPickBoard({
  data,
  selectedTeamId,
  showAll,
  userTeamId,
  hoveredTeamId,
  defaultCollapsedRoundIds = [],
  visibleRoundIds,
}: DraftYearPickBoardProps) {
  const isMobile = useIsMobile();
  const { containerRef, rowHeight } = useRowHeight();

  const [collapsedRoundIds, setCollapsedRoundIds] = useState<
    Array<keyof DraftYearType>
  >(defaultCollapsedRoundIds);
  const [activeTab, setActiveTab] = useState<"all" | keyof DraftYearType>(
    "all",
  );

  const toggleRound = (roundId: keyof DraftYearType) => {
    setCollapsedRoundIds((cur) =>
      cur.includes(roundId)
        ? cur.filter((id) => id !== roundId)
        : [...cur, roundId],
    );
  };

  const visibleRounds = DRAFT_ROUNDS.filter(
    (r) => !visibleRoundIds || visibleRoundIds.includes(r.id),
  );

  if (isMobile) {
    const roundsToShow =
      activeTab === "all"
        ? visibleRounds
        : visibleRounds.filter((r) => r.id === activeTab);

    return (
      <div className="flex flex-col">
        <DraftRoundTabBar active={activeTab} onChange={setActiveTab} />
        <div className="h-screen px-4 overflow-auto block pb-[500px]">
          {roundsToShow.map((round) => (
            <DraftRoundMobileList
              key={round.id}
              title={round.title}
              picks={filterPicks({
                picks: data?.[round.id] ?? [],
                selectedTeamId,
                showAll,
              })}
              userTeamId={userTeamId}
            />
          ))}
        </div>
      </div>
    );
  }

  const firstExpandedIndex = visibleRounds.findIndex(
    (r) => !collapsedRoundIds.includes(r.id),
  );

  return (
    <div className="w-full overflow-x-auto bg-background p-4">
      <div className="flex min-w-max gap-4">
        {visibleRounds.map((round, index) => (
          <DraftRoundColumn
            key={round.id}
            title={round.title}
            picks={filterPicks({
              picks: data?.[round.id] ?? [],
              selectedTeamId,
              showAll,
            })}
            collapsed={collapsedRoundIds.includes(round.id)}
            onToggleCollapse={() => toggleRound(round.id)}
            userTeamId={userTeamId}
            hoveredTeamId={hoveredTeamId}
            rowHeight={rowHeight}
            bodyRef={index === firstExpandedIndex ? containerRef : null}
          />
        ))}
      </div>
    </div>
  );
}
