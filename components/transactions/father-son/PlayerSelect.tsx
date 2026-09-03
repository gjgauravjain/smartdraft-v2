"use client";

import { TeamType } from "@/app/api/type/common";
import { PlayerDatabaseType } from "@/app/api/type/player";
import RequiredLabel from "@/components/common/fields/RequiredLabel";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronDown, User } from "lucide-react";
import { useMemo, useState } from "react";
import { PlayerBoardSelect } from "./PlayerBoardSelect";
import { playerName } from "./util";

export type PlayerSource = "all" | "talentOrder";

type PlayerSelectProps = {
  playerSource: PlayerSource;
  setPlayerSource: (source: PlayerSource) => void;
  talentOrderOptions: SelectOption[];
  talentOrderId: string;
  onTalentOrderChange: (value: string) => void;
  playersOptions: PlayerDatabaseType[];
  value?: string;
  onSelect: (playerId: string) => void;
  variant?: "popover" | "inline";
  showLabel?: boolean;
  disabledIds?: Set<string>;
  teamsById?: Map<string, TeamType>;
};

const PlayerSelect = ({
  playerSource,
  setPlayerSource,
  talentOrderOptions,
  talentOrderId,
  onTalentOrderChange,
  playersOptions,
  value,
  onSelect,
  variant = "popover",
  showLabel = true,
  disabledIds,
  teamsById,
}: PlayerSelectProps) => {
  const [boardOpen, setBoardOpen] = useState(false);
  const isMobile = useIsMobile();
  const isInline = variant === "inline";

  const selectedTalentOrder = talentOrderOptions.find(
    (option) => option.value === talentOrderId,
  );
  const selectedPlayer = playersOptions.find((player) => player.id === value);

  const boardPlayers = useMemo(
    () => playersOptions.map((player, index) => ({ ...player, rank: index + 1 })),
    [playersOptions],
  );

  const handleBoardSelect = (playerId: string) => {
    onSelect(playerId);
    setBoardOpen(false);
  };

  const board = (
    <PlayerBoardSelect
      key={playerSource}
      players={boardPlayers}
      boardTotal={isInline ? undefined : boardPlayers.length}
      value={value}
      onSelect={handleBoardSelect}
      disabledIds={disabledIds}
      hideRank={playerSource === "all"}
      teamsById={teamsById}
      countText={
        isInline
          ? (filteredCount) => `${filteredCount} available`
          : undefined
      }
      placeholder={
        playerSource === "all" ? "Search all players…" : "Search your board…"
      }
      showSwitchFooter={playerSource === "talentOrder"}
      onSwitchToAll={() => {
        setPlayerSource("all");
        setBoardOpen(false);
      }}
      className={
        isInline
          ? "flex min-h-0 flex-1 flex-col shadow-[0_18px_44px_-12px_rgba(20,28,42,0.28)]"
          : undefined
      }
      listClassName={isInline ? "max-h-none flex-1" : undefined}
    />
  );

  return (
    <div className={cn(isInline && "flex min-h-0 flex-1 flex-col")}>
      {showLabel ? (
        <div className="mb-1.5 text-[11px] font-bold text-foreground">
          <RequiredLabel>Player</RequiredLabel>
        </div>
      ) : null}

      <div className="mb-1.5 inline-flex max-w-full items-center gap-0.5 rounded-lg border border-border bg-muted p-0.75">
        <button
          type="button"
          onClick={() => setPlayerSource("all")}
          className={cn(
            "inline-flex h-6.5 items-center whitespace-nowrap rounded-md border px-2.5 text-[11px] font-extrabold transition-colors",
            playerSource === "all"
              ? "border bg-card text-highlight-text shadow-sm"
              : "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          All players
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={() => {
                if (playerSource !== "talentOrder" && talentOrderId) {
                  setPlayerSource("talentOrder");
                }
              }}
              className={cn(
                "inline-flex h-6.5 max-w-47.5 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-[11px] font-semibold transition-colors",
                playerSource === "talentOrder"
                  ? "border bg-card text-highlight-text shadow-sm"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-[10px]">★</span>
              <span className="truncate">
                {selectedTalentOrder?.label ?? "Talent order"}
              </span>
              <span className="text-[8.5px] opacity-70">▾</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-[70] w-56">
            {talentOrderOptions.length === 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                No talent order available
              </div>
            )}
            {talentOrderOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onTalentOrderChange(option.value)}
                className={cn(
                  "text-[12.5px]",
                  option.value === talentOrderId && "font-bold text-primary",
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isInline ? (
        board
      ) : (
        <Popover open={boardOpen} onOpenChange={setBoardOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 text-left text-[13px] transition-colors hover:border-foreground/20",
                !selectedPlayer && "text-text4",
              )}
            >
              <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">
                {selectedPlayer
                  ? playerName(selectedPlayer)
                  : "Select player"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={4}
            portalled={!isMobile}
            className="w-95 max-w-[calc(100vw-24px)] p-0"
          >
            {board}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default PlayerSelect;
