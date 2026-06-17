"use client";

import { TeamType } from "@/app/api/type/common";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type SortKey = "pick" | "pts" | "club" | "reason";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "pick", label: "Sort: Pick" },
  { value: "pts", label: "Sort: Points" },
  { value: "club", label: "Sort: Club" },
  { value: "reason", label: "Sort: Reason" },
];

type Props = {
  teams: TeamType[];
  clubFilter: string;
  reasonFilter: string;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onClubChange: (v: string) => void;
  onReasonChange: (v: string) => void;
  onSortKeyChange: (v: SortKey) => void;
  onSortDirToggle: () => void;
  data: DataFullOrderListType[];
};

const selectCls = cn(
  "h-[30px] shrink-0 rounded-md border border-border bg-card",
  "text-[11.5px] font-medium text-foreground px-2 cursor-pointer",
  "focus:outline-none focus:ring-0",
);

const MobileFullListFilter = ({
  teams,
  clubFilter,
  reasonFilter,
  sortKey,
  sortDir,
  onClubChange,
  onReasonChange,
  onSortKeyChange,
  onSortDirToggle,
  data,
}: Props) => {
  const teamOptions = useMemo(() => {
    return teams.map((item) => ({
      label: item.teamNames,
      value: item.shortName,
      icon: (
        <img
          src={item.image}
          className="h-4 w-4 inline-flex object-cover rounded-2xl"
          alt={item.shortName}
        />
      ),
    }));
  }, [teams]);
  const reasons = [
    ...new Set(
      data
        .map((item) => item.reason?.trim())
        .filter((reason): reason is string => Boolean(reason)),
    ),
  ];
  const REASONS_OPTIONS = reasons.map((reason) => ({
    label: reason,
    value: reason,
  }));
  return (
    <div className="flex items-center gap-1.75 px-3 pt-2.5 pb-1 overflow-x-auto shrink-0">
      <SearchableDropdown
        value={clubFilter}
        options={[
          {
            label: "All Clubs",
            value: "ALL",
            icon: null,
          },
          ...teamOptions,
        ]}
        onChange={onClubChange}
        placeholder="Select club"
        searchPlaceholder="Search club..."
        emptyMessage="No talent orders found."
        triggerClassName="border bg-card px-2 shadow-none bg-transparent! h-7 text-xs font-normal hover:bg-transparent focus:ring-0 focus:ring-offset-0"
      />

      <SearchableDropdown
        value={reasonFilter}
        options={[
          {
            label: "All Reasons",
            value: "ALL",
            icon: null,
          },
          ...REASONS_OPTIONS,
        ]}
        onChange={onReasonChange}
        placeholder="Select reason"
        searchPlaceholder="Search reason..."
        emptyMessage="No reason found."
        triggerClassName="border bg-card px-2 shadow-none bg-transparent! h-7 text-xs font-normal hover:bg-transparent focus:ring-0 focus:ring-offset-0"
      />

      <select
        value={sortKey}
        onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
        className={selectCls}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        onClick={onSortDirToggle}
        title="Toggle sort direction"
        className={cn(
          "shrink-0 w-8 h-7.5 rounded-md border border-border bg-card",
          "text-[13px] text-muted-foreground cursor-pointer",
          "flex items-center justify-center transition-colors hover:bg-muted",
        )}
      >
        {sortDir === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
};

export default MobileFullListFilter;
