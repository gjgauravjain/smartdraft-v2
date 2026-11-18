"use client";

import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TradePickerClubGroups, TradePickerYear } from "../type";
import {
  pickerGridClass,
  pickTileClass,
  pickTilePoints,
} from "../util";
import { TradeTeamClubFilters } from "./TradeTeamClubFilters";

type TradeTeamPicksPaneProps = {
  groups: TradePickerClubGroups;
  activeClubId: string;
  years: TradePickerYear[];
  picksLoading: boolean;
  isMobile: boolean;
  takenUniques: Set<string>;
  selectedPicks: Record<string, DraftPicksDataType>;
  onClub: (clubId: string) => void;
  onTogglePick: (pick: DraftPicksDataType) => void;
};

export const TradeTeamPicksPane = ({
  groups,
  activeClubId,
  years,
  picksLoading,
  isMobile,
  takenUniques,
  selectedPicks,
  onClub,
  onTogglePick,
}: TradeTeamPicksPaneProps) => (
  <>
    <TradeTeamClubFilters
      label="In trade"
      clubs={groups.inTrade}
      activeClubId={activeClubId}
      onClub={onClub}
    />
    <TradeTeamClubFilters
      label="Other clubs"
      clubs={groups.other}
      activeClubId={activeClubId}
      onClub={onClub}
    />
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-5">
      {picksLoading && years.length === 0 ? (
        <p className="pt-3 text-[11.5px] text-muted-foreground">
          Loading picks.
        </p>
      ) : null}
      {!picksLoading && years.length === 0 ? (
        <p className="pt-3 text-[11.5px] text-muted-foreground">
          This club has no picks to add.
        </p>
      ) : null}
      {years.map((year) => (
        <div
          key={year.year}
          className="grid grid-cols-1 gap-1.5 border-b border-border py-2 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-3"
        >
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase sm:leading-8.5">
            {year.year}
          </span>
          <div className={pickerGridClass(isMobile)}>
            {year.picks.map((pick) => {
              const taken = takenUniques.has(pick.unique);
              const selected = Boolean(selectedPicks[pick.unique]);
              return (
                <button
                  key={pick.unique}
                  type="button"
                  disabled={taken}
                  aria-pressed={selected}
                  title={taken ? "In trade" : undefined}
                  onClick={() => onTogglePick(pick)}
                  className={pickTileClass({
                    taken,
                    selected,
                    future: year.future,
                  })}
                >
                  <b className="max-w-full truncate px-1 text-[11.5px] leading-none font-semibold tabular-nums">
                    {pick.display || pick.label}
                  </b>
                  <span className="text-[10px] leading-none text-muted-foreground">
                    {pickTilePoints(taken, pick.points)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </>
);