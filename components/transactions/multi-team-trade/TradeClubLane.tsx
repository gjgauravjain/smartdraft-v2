import { TeamType } from "@/app/api/type/common";
import { TradeImpactTeam } from "@/app/api/type/trade";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { TradeAssetChip } from "./TradeAssetChip";
import { TradeClubFlag } from "./TradeClubFlag";
import { TradeClubSelect } from "./TradeClubSelect";
import { TradeLane } from "./type";
import { clubShortName, formatPoints } from "./util";
import { DetailCard } from "./DetailCard";

export const TradeClubLane = ({
  lane,
  options,
  teamsById,
  takenClubIds,
  ptsIn,
  canRemove,
  isMobile = false,
  impactTeam,
  onClubChange,
  onRemoveClub,
  onRemovePick,
  onRemovePlayer,
  onAddPick,
  onAddPlayer,
}: {
  lane: TradeLane;
  options: SelectOption[];
  teamsById: Map<string, TeamType>;
  takenClubIds: Set<string>;
  ptsIn: number;
  canRemove: boolean;
  isMobile?: boolean;
  impactTeam?: TradeImpactTeam;
  onClubChange: (teamId: string) => void;
  onRemoveClub: () => void;
  onRemovePick: (unique: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onAddPick: () => void;
  onAddPlayer: () => void;
}) => {
  const selected = Boolean(lane.teamId);
  const assetsEnabled = selected;
  const club = teamsById.get(lane.teamId);

  const pickChips = lane.picksIn.map((pick) => (
    <TradeAssetChip
      key={pick.unique}
      label={`Pick ${pick.overallPick}`}
      meta={`${clubShortName(teamsById.get(pick.currentOwner), "Club")} · ${formatPoints(pick.points)}`}
      onRemove={() => onRemovePick(pick.unique)}
      compact={isMobile}
    />
  ));

  const playerChips = lane.playersIn.map((player) => (
    <TradeAssetChip
      key={player.playerId}
      icon={<TradeClubFlag team={teamsById.get(player.fromTeamId)} size="sm" />}
      label={player.playerName}
      meta={clubShortName(teamsById.get(player.fromTeamId))}
      onRemove={() => onRemovePlayer(player.playerId)}
      compact={isMobile}
    />
  ));

  if (isMobile && selected) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <TradeClubSelect
              value={lane.teamId}
              options={options}
              teamsById={teamsById}
              disabledValues={takenClubIds}
              onChange={onClubChange}
            />
          </div>
          {canRemove ? (
            <button
              type="button"
              onClick={onRemoveClub}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
              aria-label="Remove club"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-[7px] rounded-[11px] border border-border bg-card px-[11px] py-[9px]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.6px] text-muted-foreground">
              Receives
            </span>
            <span className="flex-1" />
            <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
              {formatPoints(ptsIn)} pts in
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {pickChips}
            {playerChips}
            <DashedAddButton label="Pick" onClick={onAddPick} />
            <DashedAddButton label="Player" onClick={onAddPlayer} />
          </div>
        </div>

        {impactTeam ? (
          <DetailCard team={impactTeam} club={club} title="impact" />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-[11px] border border-border bg-card p-3.5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <TradeClubSelect
            value={lane.teamId}
            options={options}
            teamsById={teamsById}
            disabledValues={takenClubIds}
            onChange={onClubChange}
          />
        </div>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemoveClub}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
            aria-label="Remove club"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-1.5 flex items-baseline gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.7px] text-muted-foreground">
            Receives
          </span>
          <span className="flex-1" />
          {selected ? (
            <span className="text-[10.5px] font-bold tabular-nums text-muted-foreground">
              {formatPoints(ptsIn)} pts in
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col rounded-[9px] border border-border/80 bg-muted/60",
            !selected && "opacity-65",
          )}
        >
          <div className="flex flex-1 items-start gap-2.5 px-2.5 py-2">
            <span className="w-[52px] shrink-0 pt-2 text-[9.5px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Picks
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {lane.picksIn.length ? (
                pickChips
              ) : (
                <span className="text-[11px] italic leading-[30px] text-muted-foreground">
                  No picks yet
                </span>
              )}
            </div>
            <DashedAddButton
              label="Pick"
              disabled={!assetsEnabled}
              onClick={onAddPick}
            />
          </div>

          <div className="flex items-start gap-2.5 border-t border-border/80 px-2.5 py-2">
            <span className="w-[52px] shrink-0 pt-2 text-[9.5px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Players
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {lane.playersIn.length ? (
                playerChips
              ) : (
                <span className="text-[11px] italic leading-[30px] text-muted-foreground">
                  No players yet
                </span>
              )}
            </div>
            <DashedAddButton
              label="Player"
              disabled={!assetsEnabled}
              onClick={onAddPlayer}
            />
          </div>
        </div>

        {!selected ? (
          <p className="mt-1.5 text-[10.5px] text-muted-foreground">
            Choose a club to add the picks and players it receives.
          </p>
        ) : null}
      </div>
    </div>
  );
};

const DashedAddButton = ({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <Button
    type="button"
    variant="ghost"
    disabled={disabled}
    onClick={onClick}
    className="h-[30px] shrink-0 gap-1 rounded-full border border-dashed border-border px-3 text-[11.5px] font-bold text-muted-foreground hover:bg-transparent hover:text-foreground"
  >
    <Plus className="h-3 w-3" />
    {label}
  </Button>
);
