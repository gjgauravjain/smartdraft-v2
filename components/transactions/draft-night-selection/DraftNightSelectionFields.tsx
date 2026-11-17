"use client";

import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { DraftPoolPlayer } from "@/app/api/type/player";
import { DraftNightPickField } from "./DraftNightPickField";
import { DraftNightPlayerField } from "./DraftNightPlayerField";
import { DraftNightSummary } from "./DraftNightSummary";

type DraftNightSelectionFieldsProps = {
  isMobile: boolean;
  teams: TeamType[];
  years: number[];
  yearFilter: number | null;
  onYearChange: (year: number) => void;
  visiblePicks: DraftPicksDataType[];
  players: DraftPoolPlayer[];
  pickQuery: string;
  onPickQueryChange: (query: string) => void;
  playerQuery: string;
  onPlayerQueryChange: (query: string) => void;
  openPanel: "pick" | "player" | null;
  onTogglePanel: (panel: "pick" | "player") => void;
  onDismiss: () => void;
  onSelectPick: (pickId: string) => void;
  onSelectPlayer: (player: DraftPoolPlayer) => void;
  selectedPick: DraftPicksDataType | null;
  selectedPlayer: DraftPoolPlayer | null;
  picksLoading: boolean;
  picksError: string | null;
  playersLoading: boolean;
  playersError: string | null;
  saveError: string[];
};

export const DraftNightSelectionFields = ({
  isMobile,
  teams,
  years,
  yearFilter,
  onYearChange,
  visiblePicks,
  players,
  pickQuery,
  onPickQueryChange,
  playerQuery,
  onPlayerQueryChange,
  openPanel,
  onTogglePanel,
  onDismiss,
  onSelectPick,
  onSelectPlayer,
  selectedPick,
  selectedPlayer,
  picksLoading,
  picksError,
  playersLoading,
  playersError,
  saveError,
}: DraftNightSelectionFieldsProps) => {
  return (
    <div className="flex flex-col gap-3.5">
      <DraftNightPickField
        isMobile={isMobile}
        open={openPanel === "pick"}
        onToggle={() => onTogglePanel("pick")}
        onDismiss={onDismiss}
        picks={visiblePicks}
        years={years}
        year={yearFilter}
        onYearChange={onYearChange}
        query={pickQuery}
        onQueryChange={onPickQueryChange}
        selected={selectedPick}
        onSelect={onSelectPick}
        teams={teams}
        loading={picksLoading}
        error={picksError}
      />
      <DraftNightPlayerField
        isMobile={isMobile}
        open={openPanel === "player"}
        onToggle={() => onTogglePanel("player")}
        onDismiss={onDismiss}
        players={players}
        query={playerQuery}
        onQueryChange={onPlayerQueryChange}
        selected={selectedPlayer}
        onSelect={onSelectPlayer}
        loading={playersLoading}
        error={playersError}
      />
      <DraftNightSummary
        isMobile={isMobile}
        pick={selectedPick}
        player={selectedPlayer}
        teams={teams}
      />
      <SaveError messages={saveError} />
    </div>
  );
};

const SaveError = ({ messages }: { messages: string[] }) => {
  if (!messages.length) return null;

  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-destructive">
      <span className="mt-px grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] font-extrabold text-white">
        !
      </span>
      <span>
        {messages.map((message, index) => (
          <span key={`${message}-${index}`} className="block">
            {message}
          </span>
        ))}
      </span>
    </div>
  );
};
