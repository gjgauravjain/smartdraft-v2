import { TeamType } from "@/app/api/type/common";
import { TradeImpactResponse } from "@/app/api/type/trade";
import { TradeImpactBars } from "./trade-impact/TradeImpactBars";
import { TradeImpactBeam } from "./trade-impact/TradeImpactBeam";
import { TradeImpactTiles } from "./trade-impact/TradeImpactTiles";
import { TradeImpactSkeleton } from "./trade-impact/TradeImpactSkeleton";
import { TradeImpactDetail } from "./trade-impact/TradeImpactDetail";

export const TradeImpact = ({
  impactData,
  impactLoading,
  impactError,
  teamsById,
  isMobile,
  showHeadline = true,
  showDetail = true,
}: {
  impactData: TradeImpactResponse | null;
  impactLoading: boolean;
  impactError: string | null;
  teamsById: Map<string, TeamType>;
  isMobile: boolean;
  showHeadline?: boolean;
  showDetail?: boolean;
}) => {
  const renderImpact = () => {
    if (impactLoading) {
      return <TradeImpactSkeleton />;
    }
    if (impactError) {
      return (
        <p className="px-4 py-[22px] text-center text-xs italic text-destructive">
          {impactError}
        </p>
      );
    }
    if (!impactData) {
      return (
        <p className="px-4 py-[22px] text-center text-xs italic text-muted-foreground">
          Add two clubs and at least one pick or player to preview the trade
          impact.
        </p>
      );
    }
    if (isMobile) {
      return (
        <TradeImpactTiles teams={impactData.teams} teamsById={teamsById} />
      );
    }
    if (impactData.teams.length === 2) {
      return <TradeImpactBeam teams={impactData.teams} teamsById={teamsById} />;
    }
    return <TradeImpactBars teams={impactData.teams} teamsById={teamsById} />;
  };
  const renderHeader = () => {
    if (!showHeadline) return null;

    return (
      <>
        {!isMobile ? (
          <div className="mb-2 flex items-center gap-2">
            <div className="whitespace-nowrap text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-muted-foreground">
              Trade impact
            </div>
            <span className="h-px min-w-6 flex-1 bg-border" />
          </div>
        ) : null}

        {isMobile && !impactData && !impactLoading && !impactError ? (
          <p className="px-4 py-[22px] text-center text-xs italic text-muted-foreground">
            Add two clubs and at least one pick or player to preview the trade
            impact.
          </p>
        ) : (
          <div className="rounded-xl border border-border bg-card p-[18px] px-5">
            {renderImpact()}
          </div>
        )}
      </>
    );
  };
  return (
    <section>
      {renderHeader()}

      {showDetail && impactData && !impactLoading ? (
        <TradeImpactDetail
          impact={impactData}
          teamsById={teamsById}
          showTeamCards={!isMobile}
        />
      ) : null}
    </section>
  );
};
