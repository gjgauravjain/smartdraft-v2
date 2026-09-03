import { TeamType } from "@/app/api/type/common";
import { TradeImpactTeam } from "@/app/api/type/trade";
import { formatSignedPoints, maxAbsNet } from "../util";
import { TradeClubFlag } from "../TradeClubFlag";

export const TradeImpactBars = ({
  teams,
  teamsById,
}: {
  teams: TradeImpactTeam[];
  teamsById: Map<string, TeamType>;
}) => {
  const maxAbs = maxAbsNet(teams);

  return (
    <div className="flex flex-col gap-2">
      {teams.map((team) => {
        const club = teamsById.get(String(team.teamId));
        const fill = (Math.abs(team.netResult) / maxAbs) * 100;
        return (
          <div key={team.teamId} className="flex items-center gap-2.5">
            <div className="flex w-36 shrink-0 items-center gap-1.5">
              <TradeClubFlag team={club} />
              <span className="truncate text-xs font-bold">
                {club?.teamNames ?? team.teamName}
              </span>
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${fill}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-xs font-extrabold tabular-nums">
              {formatSignedPoints(team.netResult)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
