import { TeamType } from "@/app/api/type/common";
import { TradeImpactTeam } from "@/app/api/type/trade";
import { clubShortName, formatSignedPoints, maxAbsNet } from "../util";
import { TradeClubFlag } from "../TradeClubFlag";

export const TradeImpactTiles = ({
  teams,
  teamsById,
}: {
  teams: TradeImpactTeam[];
  teamsById: Map<string, TeamType>;
}) => {
  const maxAbs = maxAbsNet(teams);
  const wrap = teams.length >= 4;

  return (
    <div
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: wrap
          ? "repeat(2, minmax(0, 1fr))"
          : `repeat(${teams.length}, minmax(0, 1fr))`,
      }}
    >
      {teams.map((team) => {
        const club = teamsById.get(String(team.teamId));
        const fill = (Math.abs(team.netResult) / maxAbs) * 100;
        return (
          <div
            key={team.teamId}
            className="flex min-w-0 flex-col items-center gap-0.5 rounded-[9px] border border-border bg-card px-1.5 py-2"
          >
            <div className="flex items-center gap-1">
              <TradeClubFlag team={club} size="sm" />
              <span className="text-[10px] font-extrabold tracking-wide text-muted-foreground">
                {clubShortName(club, team.teamName)}
              </span>
            </div>
            <span className="text-sm font-extrabold tabular-nums tracking-tight text-foreground">
              {formatSignedPoints(team.netResult)}
            </span>
            <span className="h-[11px] text-[8.5px] tabular-nums text-muted-foreground">
              {team.netResultEquivalentPick != null
                ? `≈ pick ${team.netResultEquivalentPick}`
                : ""}
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-highlight-text"
                style={{ width: `${fill}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
