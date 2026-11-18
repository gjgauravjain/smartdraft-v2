"use client";

import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { PlayerLookupType } from "@/app/api/type/player";
import { TeamType } from "@/app/api/type/common";
import { TradeTeamFilterChip } from "./commonTradeComponent/TradeTeamFilterChip";
import { TradeTeamPicksPane } from "./commonTradeComponent/TradeTeamPicksPane";
import { TradeTeamPlayersPane } from "./commonTradeComponent/TradeTeamPlayersPane";
import {
  TradePickerClubGroups,
  TradePickerTab,
  TradePickerYear,
} from "./type";
import {
  addButtonLabel,
  pickerHint,
  pickerPlayersMessage,
} from "./util";

type TradeTeamPickerProps = {
  clubName: string;
  tab: TradePickerTab;
  groups: TradePickerClubGroups;
  activeClubId: string;
  years: TradePickerYear[];
  picksLoading: boolean;
  isMobile: boolean;
  takenUniques: Set<string>;
  selectedPicks: Record<string, DraftPicksDataType>;
  selectedPlayers: Record<string, PlayerLookupType>;
  selectedCount: number;
  teamsMap: Map<string, TeamType>;
  playerQuery: string;
  visiblePlayers: PlayerLookupType[];
  playersLoading: boolean;
  playersSearching: boolean;
  onTab: (tab: TradePickerTab) => void;
  onClub: (clubId: string) => void;
  onTogglePick: (pick: DraftPicksDataType) => void;
  onTogglePlayer: (player: PlayerLookupType) => void;
  onPlayerQuery: (value: string) => void;
  onClose: () => void;
  onAdd: () => void;
};

export const TradeTeamPicker = ({
  clubName,
  tab,
  groups,
  activeClubId,
  years,
  picksLoading,
  isMobile,
  takenUniques,
  selectedPicks,
  selectedPlayers,
  selectedCount,
  teamsMap,
  playerQuery,
  visiblePlayers,
  playersLoading,
  playersSearching,
  onTab,
  onClub,
  onTogglePick,
  onTogglePlayer,
  onPlayerQuery,
  onClose,
  onAdd,
}: TradeTeamPickerProps) => {
  const hint = pickerHint(selectedCount, tab);
  const playersMessage = pickerPlayersMessage({
    loading: playersLoading,
    count: visiblePlayers.length,
    searching: playersSearching,
  });

  return (
    <div className="absolute inset-0 z-20 flex flex-col rounded-[inherit] bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="size-7 text-lg leading-none text-muted-foreground hover:rounded-md hover:bg-muted"
        >
          ←
        </button>
        <h3 className="text-[15px] font-bold text-foreground">
          {clubName} receives
        </h3>
      </div>
      <div className="flex flex-wrap gap-1 px-4 pt-2.5 sm:px-5">
        <TradeTeamFilterChip
          label="Picks"
          selected={tab === "picks"}
          onClick={() => onTab("picks")}
        />
        <TradeTeamFilterChip
          label="Players"
          selected={tab === "players"}
          onClick={() => onTab("players")}
        />
      </div>

      {tab === "picks" ? (
        <TradeTeamPicksPane
          groups={groups}
          activeClubId={activeClubId}
          years={years}
          picksLoading={picksLoading}
          isMobile={isMobile}
          takenUniques={takenUniques}
          selectedPicks={selectedPicks}
          onClub={onClub}
          onTogglePick={onTogglePick}
        />
      ) : (
        <TradeTeamPlayersPane
          playerQuery={playerQuery}
          players={visiblePlayers}
          message={playersMessage}
          selectedPlayers={selectedPlayers}
          teamsMap={teamsMap}
          onPlayerQuery={onPlayerQuery}
          onTogglePlayer={onTogglePlayer}
        />
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2.5 sm:px-5">
        <span className="min-w-0 flex-1 basis-full text-[11.5px] text-muted-foreground sm:basis-auto">
          {hint ? (
            hint
          ) : (
            <b className="font-bold text-foreground">
              {selectedCount} selected
            </b>
          )}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="h-9 flex-1 rounded-lg border border-border bg-card px-4 text-[13px] font-semibold sm:flex-none"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={onAdd}
          className="h-9 flex-1 rounded-lg border border-primary bg-primary px-4 text-[13px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35 sm:flex-none"
        >
          {addButtonLabel(selectedCount)}
        </button>
      </div>
    </div>
  );
};