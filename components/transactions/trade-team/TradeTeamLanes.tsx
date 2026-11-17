"use client";

import { TeamType } from "@/app/api/type/common";
import { TradeImpactResponse } from "@/app/api/type/trade";
import { TradeTeamAddClub } from "./commonTradeComponent/TradeTeamAddClub";
import { TradeTeamCard } from "./TradeTeamCard";
import { TradeLane } from "./type";
import {
  giveRows,
  impactTeamForLane,
  receiveRows,
} from "./util";

type TradeTeamLanesProps = {
  lanes: TradeLane[];
  teams: TeamType[];
  points: Map<string, number | null>;
  impact: TradeImpactResponse | null;
  isMobile: boolean;
  onClubChange: (laneId: string, teamId: string) => void;
  onRemoveClub: (laneId: string) => void;
  onRemovePick: (laneId: string, unique: string) => void;
  onRemovePlayer: (laneId: string, playerId: string) => void;
  onAdd: (laneId: string) => void;
  onAddClub: (teamId: string) => void;
  previewPending: boolean;
};

export const TradeTeamLanes = ({
  lanes,
  teams,
  points,
  impact,
  isMobile,
  onClubChange,
  onRemoveClub,
  onRemovePick,
  onRemovePlayer,
  onAdd,
  onAddClub,
  previewPending,
}: TradeTeamLanesProps) => {
  const taken = new Set(lanes.map((lane) => lane.teamId).filter(Boolean));
  const inlineAdd = !isMobile && lanes.length < 3;
  const columns = isMobile ? 1 : 3;

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {lanes.map((lane) => {
          const impactTeam = impactTeamForLane(impact, lane.teamId);
          const otherTeams = new Set(taken);
          if (lane.teamId) otherTeams.delete(lane.teamId);
          return (
            <TradeTeamCard
              key={lane.id}
              lane={lane}
              teams={teams}
              takenTeamIds={otherTeams}
              canRemove={lanes.length > 2}
              impactTeam={impactTeam}
              receives={receiveRows(lane, impactTeam)}
              gives={giveRows(impactTeam, points)}
              onClubChange={(teamId) => onClubChange(lane.id, teamId)}
              onRemoveClub={() => onRemoveClub(lane.id)}
              onRemovePick={(unique) => onRemovePick(lane.id, unique)}
              onRemovePlayer={(playerId) => onRemovePlayer(lane.id, playerId)}
              onAdd={() => onAdd(lane.id)}
              previewPending={previewPending}
              isMobile={isMobile}
            />
          );
        })}
        {inlineAdd ? (
          <TradeTeamAddClub teams={teams} taken={taken} onAddClub={onAddClub} />
        ) : null}
      </div>
      {inlineAdd ? null : (
        <TradeTeamAddClub
          teams={teams}
          taken={taken}
          compact
          onAddClub={onAddClub}
        />
      )}
    </div>
  );
};