import { Filter } from "lucide-react";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { useMemo } from "react";

type Props = {
  data: DataFullOrderListType[];
  clubFilter: string;
  reasonFilter: string;
  onClubChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  teams: TeamType[];
};

const FullListFilters = ({
  data,
  clubFilter,
  reasonFilter,
  onClubChange,
  onReasonChange,
  teams,
}: Props) => {
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

  return (
    <div className="flex items-center gap-2.5 mb-2.5 shrink-0">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Filter size={13} strokeWidth={1.8} />
        <span className="text-[11px] font-semibold">Filter</span>
      </span>

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

      <div className="flex-1" />

      <span className="text-[11px] text-muted-foreground">
        {data.length} selections
      </span>
    </div>
  );
};

export default FullListFilters;
