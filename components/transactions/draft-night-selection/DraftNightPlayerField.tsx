"use client";

import { DraftPoolPlayer } from "@/app/api/type/player";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { DraftNightSelect } from "./DraftNightSelect";
import {
  emptyOptionClass,
  formatRank,
  optionsListClass,
  optionSelectedClass,
  playerMeta,
  playerOptionGridClass,
  searchInputClass,
  selectFooterClass,
} from "./util";

type DraftNightPlayerFieldProps = {
  isMobile: boolean;
  open: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  players: DraftPoolPlayer[];
  query: string;
  onQueryChange: (query: string) => void;
  selected: DraftPoolPlayer | null;
  onSelect: (player: DraftPoolPlayer) => void;
  loading: boolean;
  error: string | null;
};

export const DraftNightPlayerField = ({
  isMobile,
  open,
  onToggle,
  onDismiss,
  players,
  query,
  onQueryChange,
  selected,
  onSelect,
  loading,
  error,
}: DraftNightPlayerFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  const meta = selected ? playerMeta(selected) : "";
  const trigger = selected ? (
    <span className="flex w-full min-w-0 items-baseline gap-1.5">
      <span className="truncate font-semibold text-foreground">
        {selected.displayName}
      </span>
      {meta ? (
        <span className="truncate text-[11.5px] text-muted-foreground">
          {meta}
        </span>
      ) : null}
    </span>
  ) : (
    <span>{loading ? "Loading players…" : "Choose a player"}</span>
  );

  return (
    <DraftNightSelect
      label="Player"
      open={open}
      hasValue={Boolean(selected)}
      onToggle={onToggle}
      onDismiss={onDismiss}
      trigger={trigger}
      error={open ? null : error}
      panel={
        <>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Search players (2+ letters)"
            className={searchInputClass()}
            autoComplete="off"
          />
          <div className={optionsListClass()} role="listbox">
            <PlayerOptions
              isMobile={isMobile}
              players={players}
              selectedId={selected?.id ?? null}
              query={query}
              loading={loading}
              error={error}
              onSelect={onSelect}
            />
          </div>
          <div className={selectFooterClass()}>
            Players already drafted in this project are excluded by the API.
          </div>
        </>
      }
    />
  );
};

const PlayerOptions = ({
  isMobile,
  players,
  selectedId,
  query,
  loading,
  error,
  onSelect,
}: {
  isMobile: boolean;
  players: DraftPoolPlayer[];
  selectedId: number | null;
  query: string;
  loading: boolean;
  error: string | null;
  onSelect: (player: DraftPoolPlayer) => void;
}) => {
  if (loading && players.length === 0) {
    return <div className={emptyOptionClass()}>Loading players…</div>;
  }
  if (error) return <div className={emptyOptionClass()}>{error}</div>;
  if (!players.length) {
    const message = query.trim().length >= 2
      ? "No players match."
      : "No players available.";
    return <div className={emptyOptionClass()}>{message}</div>;
  }

  return players.map((player) => {
    const selected = player.id === selectedId;
    return (
      <button
        key={player.id}
        type="button"
        role="option"
        aria-selected={selected}
        onClick={() => onSelect(player)}
        className={cn(
          playerOptionGridClass(isMobile),
          optionSelectedClass(selected),
        )}
      >
        <span className="truncate font-semibold">{player.displayName}</span>
        <span className="truncate text-[11.5px] text-muted-foreground">
          {player.position ?? ""}
        </span>
        <span className="text-right text-[12.5px] tabular-nums">
          {formatRank(player.rank)}
        </span>
      </button>
    );
  });
};
