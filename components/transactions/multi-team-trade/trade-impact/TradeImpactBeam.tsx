import { TeamType } from "@/app/api/type/common";
import { TradeImpactTeam } from "@/app/api/type/trade";
import {
  beamFillPercent,
  clubShortName,
  formatSignedPoints,
  maxAbsNet,
  tradeWinner,
} from "../util";
import { TradeClubFlag } from "../TradeClubFlag";
import { ClubInOut } from "./ClubInOut";

export const TradeImpactBeam = ({
  teams,
  teamsById,
}: {
  teams: TradeImpactTeam[];
  teamsById: Map<string, TeamType>;
}) => {
  const left = teams[0];
  const right = teams[1];
  const maxAbs = maxAbsNet(teams);
  const winner = tradeWinner(teams);
  const even = Boolean(winner && winner.netResult === 0);
  const leftTeam = teamsById.get(String(left.teamId));
  const rightTeam = teamsById.get(String(right.teamId));
  const leftFill = beamFillPercent(left.netResult, maxAbs);
  const rightFill = beamFillPercent(right.netResult, maxAbs);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 items-center gap-1.5">
          <TradeClubFlag team={leftTeam} size="lg" />
          <span className="text-[12.5px] font-bold text-foreground">
            {leftTeam?.teamNames ?? left.teamName}
          </span>
        </div>
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full border border-border bg-muted">
          <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
          {left.netResult > 0 ? (
            <span
              className="absolute inset-y-0 right-1/2 rounded-full bg-highlight-text"
              style={{ width: `${leftFill}%` }}
            />
          ) : null}
          {right.netResult > 0 ? (
            <span
              className="absolute inset-y-0 left-1/2 rounded-full bg-highlight-text"
              style={{ width: `${rightFill}%` }}
            />
          ) : null}
        </div>
        <div className="flex shrink-0 flex-row-reverse items-center gap-1.5">
          <TradeClubFlag team={rightTeam} size="lg" />
          <span className="text-[12.5px] font-bold text-foreground">
            {rightTeam?.teamNames ?? right.teamName}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-start gap-2.5">
        <ClubInOut team={left} align="left" />
        <div className="flex-1 text-center">
          <div className="text-xl font-extrabold tabular-nums tracking-tight text-foreground">
            {even
              ? "Even trade"
              : `${clubShortName(teamsById.get(String(winner?.teamId)), winner?.teamName ?? "")} ${formatSignedPoints(winner?.netResult ?? 0)}`}
          </div>
          {!even && winner?.netResultEquivalentPick != null ? (
            <div className="mt-0.5 text-[11.5px] tabular-nums text-muted-foreground">
              {formatSignedPoints(winner.netResult)} points ≈ pick{" "}
              {winner.netResultEquivalentPick}
            </div>
          ) : !even ? (
            <div className="mt-0.5 text-[11.5px] tabular-nums text-muted-foreground">
              {formatSignedPoints(winner?.netResult ?? 0)} points
            </div>
          ) : null}
        </div>
        <ClubInOut team={right} align="right" />
      </div>
    </div>
  );
};
