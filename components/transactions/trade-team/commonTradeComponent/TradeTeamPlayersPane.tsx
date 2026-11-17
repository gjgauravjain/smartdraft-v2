"use client";

import { PlayerLookupType } from "@/app/api/type/player";
import { TeamType } from "@/app/api/type/common";
import { playerRowClass, teamShortLabel } from "../util";

type TradeTeamPlayersPaneProps = {
  playerQuery: string;
  players: PlayerLookupType[];
  message: string;
  selectedPlayers: Record<string, PlayerLookupType>;
  teamsMap: Map<string, TeamType>;
  onPlayerQuery: (value: string) => void;
  onTogglePlayer: (player: PlayerLookupType) => void;
};

export const TradeTeamPlayersPane = ({
  playerQuery,
  players,
  message,
  selectedPlayers,
  teamsMap,
  onPlayerQuery,
  onTogglePlayer,
}: TradeTeamPlayersPaneProps) => (
  <>
    <div className="px-4 pt-2.5 sm:px-5">
      <input
        value={playerQuery}
        onChange={(event) => onPlayerQuery(event.target.value)}
        placeholder="Search players"
        aria-label="Search players"
        className="h-8 w-full rounded-md border border-border bg-card px-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
      />
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 sm:px-5">
      {message ? (
        <p className="pt-3 text-[11.5px] text-muted-foreground">{message}</p>
      ) : null}
      {players.map((player) => {
        const selected = Boolean(selectedPlayers[player.playerId]);
        return (
          <button
            key={player.playerId}
            type="button"
            onClick={() => onTogglePlayer(player)}
            className={playerRowClass(selected)}
          >
            <span className="truncate rounded-md border border-border bg-muted px-1.5 text-[11.5px] leading-6 font-semibold">
              {player.name}
            </span>
            <span className="truncate text-[11.5px] text-muted-foreground">
              {player.teamId
                ? teamShortLabel(teamsMap, player.teamId)
                : "No club"}
            </span>
            <span className="text-right text-xs text-muted-foreground">–</span>
          </button>
        );
      })}
    </div>
  </>
);