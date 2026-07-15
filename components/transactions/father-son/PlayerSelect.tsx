"use client";

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
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FatherSonBidMatchFormValues } from "./hook";
import RequiredLabel from "@/components/common/fields/RequiredLabel";
import { PlayerDatabaseType } from "@/app/api/type/player";
import { PlayerBoardSelect } from "./PlayerBoardSelect";
import { useMemo, useState } from "react";
import { ChevronDown, User } from "lucide-react";

type PlayerSelectProps = {
  playerSource: "all" | "talentOrder";
  setPlayerSource: (source: "all" | "talentOrder") => void;
  talentOrderOptions: SelectOption[];
  talentOrderId: string;
  playersOptions: PlayerDatabaseType[];
  form: UseFormReturn<
    FatherSonBidMatchFormValues,
    any,
    FatherSonBidMatchFormValues
  >;
};

function getDisplayName(player: PlayerDatabaseType) {
  const first = player.preferredFirstName || player.firstName;
  const last = player.preferredLastName || player.lastName;
  return `${first} ${last}`.trim();
}

const PlayerSelect = ({
  playerSource,
  form,
  talentOrderId,
  setPlayerSource,
  talentOrderOptions,
  playersOptions,
}: PlayerSelectProps) => {
  const [boardOpen, setBoardOpen] = useState(false);

  const selectedTalentOrder = talentOrderOptions.find(
    (o) => o.value === talentOrderId,
  );

  const selectedPlayerId = form.watch("playerId");
  const selectedPlayer = playersOptions.find((p) => p.id === selectedPlayerId);

  const handleSelectTalentOrder = (value: string) => {
    form.setValue("talentOrderId", value, { shouldValidate: true });
    setPlayerSource("talentOrder");
  };

  const boardPlayers: any[] = useMemo(
    () => playersOptions.map((p, idx) => ({ ...p, rank: idx + 1 })),
    [playersOptions],
  );

  const handleBoardSelect = (playerId: string) => {
    form.setValue("playerId", playerId, { shouldValidate: true });
    setBoardOpen(false);
  };

  return (
    <div>
      <div className="mb-1.5 text-[11px] font-bold text-foreground">
        <RequiredLabel>Player</RequiredLabel>
      </div>

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
          <DropdownMenuContent align="start" className="w-56">
            {talentOrderOptions.length === 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                No talent orders available
              </div>
            )}
            {talentOrderOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleSelectTalentOrder(option.value)}
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
                ? getDisplayName(selectedPlayer)
                : "Select player"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={4} className="w-[380px] p-0">
          <PlayerBoardSelect
            players={boardPlayers}
            boardTotal={boardPlayers.length}
            value={selectedPlayerId}
            onSelect={handleBoardSelect}
            showSwitchFooter={playerSource === "talentOrder"}
            onSwitchToAll={() => {
              setPlayerSource("all");
              setBoardOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PlayerSelect;
