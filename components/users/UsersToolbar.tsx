"use client";

import { useMemo } from "react";
import { Filter, SearchIcon } from "lucide-react";
import {
  SearchableDropdown,
  SearchableDropdownOption,
} from "@/components/ui/searchable-dropdown";
import { TIER_OPTIONS } from "@/lib/utils";
import { OrganisationListType } from "@/app/api/type/organisation";
import { UsersListFilterState } from "./type";

const filterTriggerClassName =
  "h-auto w-auto max-w-none flex-row items-center rounded-md px-[11px] py-[6px] text-[11.5px] font-semibold text-muted-foreground border-border bg-card hover:bg-muted hover:text-muted-foreground shadow-none data-[state=open]:bg-muted data-[state=open]:text-muted-foreground";

type UsersToolbarProps = {
  filters: UsersListFilterState;
  organisations: OrganisationListType[];
  onSearchChange: (v: string) => void;
  onOrgFilterChange: (v: string) => void;
  onTierFilterChange: (v: string) => void;
  onStatusFilterChange: (v: UsersListFilterState["statusFilter"]) => void;
};

export const UsersToolbar = ({
  filters,
  organisations,
  onSearchChange,
  onOrgFilterChange,
  onTierFilterChange,
  onStatusFilterChange,
}: UsersToolbarProps) => {
  const orgOptions = useMemo<SearchableDropdownOption[]>(
    () => [
      { value: "all", label: "All orgs" },
      ...organisations.map((org) => ({
        value: org.name,
        label: org.name,
      })),
    ],
    [organisations],
  );

  const tierOptions = useMemo<SearchableDropdownOption[]>(
    () => [{ value: "all", label: "All tiers" }, ...TIER_OPTIONS],
    [],
  );

  const statusOptions: SearchableDropdownOption[] = [
    { value: "all", label: "All status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="flex items-center gap-2 mb-3.5">
      <div className="relative flex-1 max-w-[300px]">
        <input
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users…"
          className="w-full py-2 pl-8 pr-3 text-[12.5px] border border-border rounded-[7px] bg-input text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground flex pointer-events-none">
          <SearchIcon strokeWidth={1.8} className="h-3 w-3" />
        </span>
      </div>

      <SearchableDropdown
        value={filters.orgFilter}
        options={orgOptions}
        onChange={onOrgFilterChange}
        placeholder="All orgs"
        searchPlaceholder="Search orgs…"
        startIcon={<Filter className="h-3 w-3" strokeWidth={1.8} />}
        triggerClassName={filterTriggerClassName}
        contentClassName="w-52"
      />

      <SearchableDropdown
        value={filters.tierFilter}
        options={tierOptions}
        onChange={onTierFilterChange}
        placeholder="All tiers"
        searchPlaceholder="Search tiers…"
        triggerClassName={filterTriggerClassName}
        contentClassName="w-48"
      />

      <SearchableDropdown
        value={filters.statusFilter}
        options={statusOptions}
        onChange={(value) =>
          onStatusFilterChange(value as UsersListFilterState["statusFilter"])
        }
        placeholder="All status"
        searchPlaceholder="Search status…"
        triggerClassName={filterTriggerClassName}
        contentClassName="w-48"
      />
    </div>
  );
};
