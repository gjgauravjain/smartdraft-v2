import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { YearHandCard } from "./YearHandCard";
import { AssetRow } from "./AssetRow";
import { formatSignedPoints } from "./util";
import { TradeClubFlag } from "./TradeClubFlag";
import { useMemo, useState } from "react";
import { TradeImpactTeam } from "@/app/api/type/trade";
import { TeamType } from "@/app/api/type/common";

export const DetailCard = ({
  team,
  club,
  title = "club",
}: {
  team: TradeImpactTeam;
  club?: TeamType;
  title?: "club" | "impact";
}) => {
  const [showAllRounds, setShowAllRounds] = useState(false);

  const yearHands = useMemo(() => {
    const years = [
      ...new Set([
        ...team.handBefore.map((item) => item.year),
        ...team.handAfter.map((item) => item.year),
      ]),
    ].sort((a, b) => a - b);
    const beforeByYear = new Map(
      team.handBefore.map((item) => [item.year, item]),
    );
    const afterByYear = new Map(
      team.handAfter.map((item) => [item.year, item]),
    );

    return years.map((year) => ({
      year,
      before: beforeByYear.get(year) ?? { year, points: 0, picks: [] },
      after: afterByYear.get(year) ?? { year, points: 0, picks: [] },
    }));
  }, [team.handAfter, team.handBefore]);

  const hasLaterRounds = yearHands.some(
    ({ before, after }) =>
      before.picks.some((pick) => pick.round > 6) ||
      after.picks.some((pick) => pick.round > 6),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
        {title === "impact" ? (
          <span className="text-[9.5px] font-extrabold uppercase tracking-[0.6px] text-muted-foreground">
            Impact · in vs out
          </span>
        ) : (
          <>
            <TradeClubFlag team={club} />
            <span className="min-w-0 truncate text-[12.5px] font-bold text-foreground">
              {club?.teamNames ?? team.teamName}
            </span>
          </>
        )}
        <span className="flex-1" />
        <span className="text-[13px] font-extrabold tabular-nums text-foreground">
          {formatSignedPoints(team.netResult)}
        </span>
        {team.netResultEquivalentPick != null ? (
          <span className="text-[10px] tabular-nums text-muted-foreground">
            ≈ pick {team.netResultEquivalentPick}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5 px-3.5 py-2.5">
        <AssetRow
          label="In"
          picks={team.picksIn}
          players={team.playersIn}
          points={team.ptsIn}
          incoming
        />
        <AssetRow
          label="Out"
          picks={team.picksOut}
          players={team.playersOut}
          points={team.ptsOut}
        />
      </div>
      <Collapsible>
        <CollapsibleContent>
          <div className="flex flex-col gap-2.5 px-3.5 pb-3">
            {yearHands.map(({ year, before, after }) => (
              <YearHandCard
                key={year}
                year={year}
                before={before}
                after={after}
                showAllRounds={showAllRounds}
              />
            ))}
            {hasLaterRounds ? (
              <button
                type="button"
                onClick={() => setShowAllRounds((current) => !current)}
                className="self-start text-[10.5px] font-bold text-highlight-text hover:underline"
              >
                {showAllRounds ? "Show rounds 1–6" : "Show all rounds"}
              </button>
            ) : null}
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger className="group mt-auto flex w-full items-center gap-1.5 border-t border-border bg-muted px-3.5 py-[7px] text-left text-[10.5px] font-bold text-muted-foreground">
          <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
          <span className="group-data-[state=open]:hidden">
            Hand before / after
          </span>
          <span className="hidden group-data-[state=open]:inline">
            Hide hand before / after
          </span>
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
};
