"use client";

import { SearchIcon } from "lucide-react";
import {
  SearchableDropdown,
  SearchableDropdownOption,
} from "@/components/ui/searchable-dropdown";
import { OrgAdminFilterState, ROLE_OPTIONS, STATE_OPTIONS } from "./util";

const filterTriggerClassName =
  "h-auto w-auto max-w-none flex-row items-center rounded-md px-[11px] py-[6px] text-[11.5px] font-semibold text-muted-foreground border-border bg-card hover:bg-muted hover:text-muted-foreground shadow-none data-[state=open]:bg-muted data-[state=open]:text-muted-foreground";

type OrgAdminToolbarProps = {
  filters: OrgAdminFilterState;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: OrgAdminFilterState["roleFilter"]) => void;
  onStateFilterChange: (value: OrgAdminFilterState["stateFilter"]) => void;
};

export const OrgAdminToolbar = ({
  filters,
  filteredCount,
  totalCount,
  onSearchChange,
  onRoleFilterChange,
  onStateFilterChange,
}: OrgAdminToolbarProps) => (
  <div className="flex items-center gap-2 mb-3.5">
    <div className="relative w-[280px]">
      <input
        value={filters.search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search members…"
        className="w-full py-2 pl-8 pr-3 text-[12.5px] border border-border rounded-[7px] bg-input text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
      />
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground flex pointer-events-none">
        <SearchIcon strokeWidth={1.8} className="h-3.5 w-3.5" />
      </span>
    </div>

    <SearchableDropdown
      value={filters.roleFilter}
      options={ROLE_OPTIONS}
      onChange={(value) =>
        onRoleFilterChange(value as OrgAdminFilterState["roleFilter"])
      }
      placeholder="All roles"
      searchPlaceholder="Search roles…"
      triggerClassName={filterTriggerClassName}
      contentClassName="w-44"
    />

    <SearchableDropdown
      value={filters.stateFilter}
      options={STATE_OPTIONS}
      onChange={(value) =>
        onStateFilterChange(value as OrgAdminFilterState["stateFilter"])
      }
      placeholder="All states"
      searchPlaceholder="Search states…"
      triggerClassName={filterTriggerClassName}
      contentClassName="w-44"
    />

    <span className="flex-1" />
    <span className="text-[11.5px] text-muted-foreground tabular-nums">
      {filteredCount} of {totalCount}
    </span>
  </div>
);
