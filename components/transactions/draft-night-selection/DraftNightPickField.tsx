"use client";

import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { useEffect, useRef } from "react";
import { DraftNightBadge } from "./DraftNightClub";
import { DraftNightSelect } from "./DraftNightSelect";
import {
  emptyOptionClass,
  optionsListClass,
  optionSelectedClass,
  pickChipClass,
  pickOptionGridClass,
  searchInputClass,
  selectFooterClass,
  teamForOwner,
  yearChipClass,
} from "./util";
import { cn } from "@/lib/utils";

type DraftNightPickFieldProps = {
  isMobile: boolean;
  open: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  picks: DraftPicksDataType[];
  years: number[];
  year: number | null;
  onYearChange: (year: number) => void;
  query: string;
  onQueryChange: (query: string) => void;
  selected: DraftPicksDataType | null;
  onSelect: (pickId: string) => void;
  teams: TeamType[];
  loading: boolean;
  error: string | null;
};

export const DraftNightPickField = ({
  isMobile,
  open,
  onToggle,
  onDismiss,
  picks,
  years,
  year,
  onYearChange,
  query,
  onQueryChange,
  selected,
  onSelect,
  teams,
  loading,
  error,
}: DraftNightPickFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  const trigger = selected ? (
    <span className="flex w-full min-w-0 items-center gap-2">
      <span className={pickChipClass(false)}>{selected.display}</span>
      <span className="truncate">{selected.label}</span>
    </span>
  ) : (
    <span>{loading ? "Loading picks…" : "Choose a pick"}</span>
  );

  return (
    <DraftNightSelect
      label="Pick"
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
            placeholder="Search picks"
            className={searchInputClass()}
            autoComplete="off"
          />
          {years.length ? (
            <div className="flex flex-wrap items-center gap-1 border-b border-border px-2.5 py-2">
              {years.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={yearChipClass(option === year)}
                  onClick={() => onYearChange(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
          <div className={optionsListClass()} role="listbox">
            <PickOptions
              isMobile={isMobile}
              picks={picks}
              selectedId={selected ? String(selected.value) : ""}
              teams={teams}
              loading={loading}
              error={error}
              onSelect={onSelect}
            />
          </div>
          <div className={selectFooterClass()}>Used picks are hidden.</div>
        </>
      }
    />
  );
};

const PickOptions = ({
  isMobile,
  picks,
  selectedId,
  teams,
  loading,
  error,
  onSelect,
}: {
  isMobile: boolean;
  picks: DraftPicksDataType[];
  selectedId: string;
  teams: TeamType[];
  loading: boolean;
  error: string | null;
  onSelect: (pickId: string) => void;
}) => {
  if (loading) return <div className={emptyOptionClass()}>Loading picks…</div>;
  if (error) return <div className={emptyOptionClass()}>{error}</div>;
  if (!picks.length) {
    return <div className={emptyOptionClass()}>No picks match.</div>;
  }

  return picks.map((pick) => {
    const team = teamForOwner(teams, pick.currentOwner);
    const pickId = String(pick.value);
    const selected = pickId === selectedId;
    return (
      <button
        key={pickId}
        type="button"
        role="option"
        aria-selected={selected}
        title={pick.label}
        onClick={() => onSelect(pickId)}
        className={cn(pickOptionGridClass(isMobile), optionSelectedClass(selected))}
      >
        <span className={pickChipClass(true)}>{pick.display}</span>
        <span className="truncate">{pick.label}</span>
        {team ? <DraftNightBadge shortName={team.shortName} /> : <span />}
      </button>
    );
  });
};
