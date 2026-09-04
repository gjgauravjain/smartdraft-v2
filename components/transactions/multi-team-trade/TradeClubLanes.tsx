import { TeamType } from "@/app/api/type/common";
import { TradeImpactTeam } from "@/app/api/type/trade";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { cn } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import { Fragment } from "react";
import { TradeClubFlag } from "./TradeClubFlag";
import { TradeClubLane } from "./TradeClubLane";
import { TradeLane } from "./type";
import { clubShortName } from "./util";

export const TradeClubLanes = ({
  lanes,
  options,
  teamsById,
  ptsInByLane,
  isMobile,
  activeLaneId,
  onSelectLane,
  onClubChange,
  onRemoveClub,
  onRemovePick,
  onRemovePlayer,
  onAddPick,
  onAddPlayer,
  impactTeams,
}: {
  lanes: TradeLane[];
  options: SelectOption[];
  teamsById: Map<string, TeamType>;
  ptsInByLane: Record<string, number>;
  isMobile: boolean;
  activeLaneId: string;
  onSelectLane: (laneId: string) => void;
  onClubChange: (laneId: string, teamId: string) => void;
  onRemoveClub: (laneId: string) => void;
  onRemovePick: (laneId: string, unique: string) => void;
  onRemovePlayer: (laneId: string, playerId: string) => void;
  onAddPick: (laneId: string) => void;
  onAddPlayer: (laneId: string) => void;
  impactTeams?: TradeImpactTeam[];
}) => {
  const takenClubIds = new Set(lanes.map((lane) => lane.teamId).filter(Boolean));
  const canRemove = lanes.length > 2;

  const renderLane = (lane: TradeLane) => (
    <TradeClubLane
      key={lane.id}
      lane={lane}
      options={options}
      teamsById={teamsById}
      takenClubIds={takenClubIds}
      ptsIn={ptsInByLane[lane.id] ?? 0}
      canRemove={canRemove}
      isMobile={isMobile}
      impactTeam={impactTeams?.find(
        (team) => String(team.teamId) === lane.teamId,
      )}
      onClubChange={(teamId) => onClubChange(lane.id, teamId)}
      onRemoveClub={() => onRemoveClub(lane.id)}
      onRemovePick={(unique) => onRemovePick(lane.id, unique)}
      onRemovePlayer={(playerId) => onRemovePlayer(lane.id, playerId)}
      onAddPick={() => onAddPick(lane.id)}
      onAddPlayer={() => onAddPlayer(lane.id)}
    />
  );

  if (isMobile) {
    const activeLane =
      lanes.find((lane) => lane.id === activeLaneId) ?? lanes[0];
    const anyClubSelected = lanes.some((lane) => lane.teamId);

    if (!anyClubSelected) {
      return (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5">
          {lanes.map((lane) => renderLane(lane))}
        </div>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        <div className="flex gap-0.5 overflow-x-auto rounded-[9px] border border-border bg-muted p-[3px]">
          {lanes.map((lane, index) => {
            const team = teamsById.get(lane.teamId);
            const selected = lane.id === activeLane.id;
            const assetCount = lane.picksIn.length + lane.playersIn.length;
            return (
              <button
                key={lane.id}
                type="button"
                onClick={() => onSelectLane(lane.id)}
                className={cn(
                  "flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[7px] px-2 text-[11px]",
                  selected
                    ? "border border-border bg-card font-extrabold text-foreground shadow-sm"
                    : "border border-transparent font-semibold text-muted-foreground",
                )}
              >
                <TradeClubFlag team={team} size="sm" />
                <span className="truncate">
                  {clubShortName(team, `Club ${index + 1}`)}
                </span>
                {lane.teamId ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-[8.5px] font-extrabold",
                      selected
                        ? "bg-highlight-text/10 text-highlight-text"
                        : "border border-border bg-card text-muted-foreground",
                    )}
                  >
                    {assetCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {activeLane ? renderLane(activeLane) : null}
      </div>
    );
  }

  const scroll = lanes.length > 3;

  return (
    <div
      className={cn(
        "flex min-w-0 items-stretch",
        lanes.length === 2 ? "gap-0" : "gap-2.5",
        scroll && "overflow-x-auto pb-1",
      )}
    >
      {lanes.map((lane, index) => (
        <Fragment key={lane.id}>
          {lanes.length === 2 && index === 1 ? (
            <div className="flex shrink-0 items-center px-2.5">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </span>
            </div>
          ) : null}
          <div
            className={cn(
              "flex min-h-0 flex-col",
              scroll
                ? "w-[calc((100%-1.25rem)/3)] shrink-0 grow-0"
                : "min-w-0 flex-1",
            )}
          >
            {renderLane(lane)}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
