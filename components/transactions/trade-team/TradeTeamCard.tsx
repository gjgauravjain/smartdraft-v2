"use client";

import { TeamType } from "@/app/api/type/common";
import { TradeImpactTeam } from "@/app/api/type/trade";
import { TradeTeamAssetRow } from "./commonTradeComponent/TradeTeamAssetRow";
import { TradeTeamSectionHead } from "./commonTradeComponent/TradeTeamSectionHead";
import { TradeAssetRow, TradeLane } from "./type";
import { formatSignedPoints, netValueClass } from "./util";

type TradeTeamCardProps = {
  lane: TradeLane;
  teams: TeamType[];
  takenTeamIds: Set<string>;
  canRemove: boolean;
  impactTeam: TradeImpactTeam | null;
  receives: { picks: TradeAssetRow[]; players: TradeAssetRow[] };
  gives: { picks: TradeAssetRow[]; players: TradeAssetRow[] };
  onClubChange: (teamId: string) => void;
  onRemoveClub: () => void;
  onRemovePick: (unique: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onAdd: () => void;
  previewPending: boolean;
  isMobile: boolean;
};

export const TradeTeamCard = ({
  lane,
  teams,
  takenTeamIds,
  canRemove,
  impactTeam,
  receives,
  gives,
  onClubChange,
  onRemoveClub,
  onRemovePick,
  onRemovePlayer,
  onAdd,
  previewPending,
  isMobile,
}: TradeTeamCardProps) => {
  const receiveCount = receives.picks.length + receives.players.length;
  const giveCount = gives.picks.length + gives.players.length;

  return (
    <article className="row-span-4 grid grid-rows-subgrid overflow-hidden rounded-[10px] border border-border bg-card px-3 pb-3 shadow-sm">
      <div className="relative -mx-3 flex items-center border-b border-border bg-muted/70 pr-1.5">
        <select
          aria-label="Club"
          value={lane.teamId}
          onChange={(event) => onClubChange(event.target.value)}
          className={
            canRemove
              ? "h-10 w-full cursor-pointer appearance-none bg-transparent pr-24 pl-3 text-[13px] font-bold text-foreground"
              : "h-10 w-full cursor-pointer appearance-none bg-transparent pr-16 pl-3 text-[13px] font-bold text-foreground"
          }
        >
          <option value="">Select club</option>
          {teams.map((team) => (
            <option
              key={team.id}
              value={String(team.id)}
              disabled={takenTeamIds.has(String(team.id))}
            >
              {team.teamNames}
            </option>
          ))}
        </select>
        {lane.teamId ? (
          <span
            className={
              canRemove
                ? "pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 text-[11.5px] font-semibold text-primary"
                : "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[11.5px] font-semibold text-primary"
            }
          >
            Change
          </span>
        ) : null}
        {canRemove ? (
          <button
            type="button"
            onClick={onRemoveClub}
            aria-label="Remove club"
            className={
              isMobile
                ? "relative z-10 size-9 text-[17px] leading-none text-muted-foreground hover:rounded-md hover:bg-background"
                : "relative z-10 size-7 text-[17px] leading-none text-muted-foreground hover:rounded-md hover:bg-background"
            }
          >
            ×
          </button>
        ) : null}
      </div>

      <section className="flex h-full flex-col gap-1 pt-1.5">
        <TradeTeamSectionHead
          label="Receives"
          count={receiveCount}
          subtotal={impactTeam && receiveCount ? impactTeam.ptsIn : null}
          tone="in"
          roomy={isMobile}
        />
        {receives.picks.map((row) => (
          <TradeTeamAssetRow
            key={row.key}
            row={row}
            onRemove={() => onRemovePick(row.key)}
            roomy={isMobile}
          />
        ))}
        {receives.players.map((row) => (
          <TradeTeamAssetRow
            key={row.key}
            row={row}
            roomy={isMobile}
            onRemove={() => onRemovePlayer(row.key)}
          />
        ))}
        {receiveCount === 0 ? (
          <div className="min-h-7.5 text-xs leading-7.5 text-muted-foreground">
            None
          </div>
        ) : null}
        <button
          type="button"
          onClick={onAdd}
          disabled={!lane.teamId}
          className="mt-auto h-7.5 rounded-md border border-dashed border-border bg-card text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add pick or player
        </button>
      </section>

      <section className="-mx-3 flex h-full flex-col gap-1 border-y border-border bg-muted px-3 py-2">
        <TradeTeamSectionHead
          label="Gives"
          count={giveCount}
          subtotal={impactTeam && giveCount ? impactTeam.ptsOut : null}
          tone="out"
          roomy={isMobile}
        />
        {gives.picks.map((row) => (
          <TradeTeamAssetRow key={row.key} row={row} muted roomy={isMobile} />
        ))}
        {gives.players.map((row) => (
          <TradeTeamAssetRow key={row.key} row={row} muted roomy={isMobile} />
        ))}
        {giveCount === 0 ? (
          <div className="min-h-7.5 text-xs leading-7.5 text-muted-foreground">
            {previewPending ? "Checking…" : "None"}
          </div>
        ) : null}
      </section>

      <footer className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 self-end pt-2 text-xs text-muted-foreground">
        <span>
          Net points
          {impactTeam && impactTeam.netResultEquivalentPick !== null
            ? ` (≈ pick ${impactTeam.netResultEquivalentPick})`
            : ""}
        </span>
        {impactTeam ? (
          <b
            className={`text-sm font-bold tabular-nums ${netValueClass(impactTeam.netResult)}`}
          >
            {formatSignedPoints(impactTeam.netResult)}
          </b>
        ) : (
          <b className="text-sm font-bold text-foreground">–</b>
        )}
      </footer>
    </article>
  );
};