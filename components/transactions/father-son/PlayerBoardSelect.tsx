"use client";

import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";
import { CornerDownLeft, Search } from "lucide-react";
import * as React from "react";
import { BoardCategory, BoardPlayer } from "./type";
import {
  CATEGORY_FILTERS,
  getDisplayName,
  getInitials,
  getPlayerCategory,
  getTag,
} from "./util";

type PlayerBoardSelectProps = {
  players: BoardPlayer[];
  boardTotal?: number;
  value?: string;
  onSelect: (playerId: string) => void;
  onSwitchToAll?: () => void;
  showSwitchFooter?: boolean;
  placeholder?: string;
  disabledIds?: Set<string>;
  hideRank?: boolean;
  teamsById?: Map<string, TeamType>;
  countText?: (filteredCount: number) => string;
  className?: string;
  listClassName?: string;
};

const clubLine = (
  player: BoardPlayer,
  teamsById?: Map<string, TeamType>,
) => {
  const teamId = player.currentRoasterAllocation?.teamId;
  const club =
    teamId && teamsById
      ? teamsById.get(String(teamId))?.teamNames
      : undefined;
  const suffix = club || player.juniorTeam;
  return [player.position, suffix].filter(Boolean).join(" · ");
};

export function PlayerBoardSelect({
  players,
  boardTotal,
  value,
  onSelect,
  onSwitchToAll,
  showSwitchFooter = true,
  placeholder = "Search your board…",
  disabledIds,
  hideRank = false,
  teamsById,
  countText,
  className,
  listClassName,
}: PlayerBoardSelectProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<BoardCategory>("all");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredPlayers = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((player) => {
      const matchesCategory =
        category === "all" || getPlayerCategory(player) === category;
      const matchesQuery =
        !q || getDisplayName(player).toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [players, query, category]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] border border-border bg-card font-sans shadow-[0_18px_44px_-12px_rgba(20,28,42,0.28)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border px-3 py-2.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground caret-primary outline-none placeholder:text-text4"
        />
        {countText ? (
          <span className="shrink-0 whitespace-nowrap text-[10px] text-text4">
            {countText(filteredPlayers.length)}
          </span>
        ) : boardTotal !== undefined ? (
          <span className="shrink-0 whitespace-nowrap text-[10px] text-text4">
            {filteredPlayers.length} of {boardTotal} on board remaining
          </span>
        ) : null}
      </div>

      <div className="flex gap-1.25 border-b border px-3 py-2">
        {CATEGORY_FILTERS.map((filter) => {
          const isActive = category === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setCategory(filter.key)}
              className={cn(
                "rounded-full border px-2.5 py-[3px] text-[10px] font-bold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "max-h-72 min-h-0 overflow-y-auto overscroll-contain",
          listClassName,
        )}
        style={{ touchAction: "pan-y" }}
        onWheel={(event) => event.stopPropagation()}
      >
        {filteredPlayers.length === 0 && (
          <div className="px-3 py-4 text-center text-[12px] text-muted-foreground">
            No players match your search.
          </div>
        )}
        {filteredPlayers.map((player) => {
          const isDisabled = disabledIds?.has(String(player.id));
          const isSelected = player.id.toString() === value?.toString();
          const tag = isDisabled ? null : getTag(player);

          return (
            <button
              key={player.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(player.id)}
              className={cn(
                "flex w-full items-center gap-2.5 border-b border px-3 py-[9px] text-left last:border-b-0",
                isDisabled
                  ? "cursor-not-allowed opacity-55"
                  : "cursor-pointer",
                !isDisabled && isSelected
                  ? "bg-primary-light"
                  : "bg-transparent",
              )}
            >
              {!hideRank ? (
                <span
                  className={cn(
                    "flex h-5.25 min-w-7.5 shrink-0 items-center justify-center rounded-md border px-1.5 text-[11px] font-extrabold tabular-nums",
                    isSelected
                      ? "border-primary/20 bg-primary-light text-highlight-text"
                      : "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  #{player.rank}
                </span>
              ) : null}

              <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[10px] font-extrabold text-muted-foreground">
                {getInitials(player)}
              </span>

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-[13px] font-bold",
                    !isDisabled && isSelected
                      ? "text-highlight-text"
                      : "text-foreground",
                  )}
                >
                  {getDisplayName(player)}
                </div>
                <div className="mt-px text-[10.5px] text-muted-foreground">
                  {clubLine(player, teamsById)}
                </div>
              </div>

              {isDisabled ? (
                <span className="shrink-0 rounded-full border border-border bg-secondary px-2 py-0.5 text-[9.5px] font-extrabold tracking-[0.3px] text-muted-foreground">
                  in trade
                </span>
              ) : null}

              {tag ? (
                <span className="shrink-0 whitespace-nowrap rounded-full border border-border bg-secondary px-2 py-0.5 text-[9.5px] font-extrabold tracking-[0.3px] text-muted-foreground">
                  {tag}
                </span>
              ) : null}

              {!isDisabled && isSelected ? (
                <CornerDownLeft className="h-3 w-3 shrink-0 text-primary" />
              ) : null}
            </button>
          );
        })}
      </div>
      {showSwitchFooter && (
        <div className="bg-secondary px-3 py-2.25 text-center text-[10.5px] text-text4">
          Player not on your board?{" "}
          <button
            type="button"
            onClick={onSwitchToAll}
            className="font-bold text-primary hover:underline"
          >
            Switch to All players
          </button>
        </div>
      )}
    </div>
  );
}
