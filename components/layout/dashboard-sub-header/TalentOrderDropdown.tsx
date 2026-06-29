"use client";

import {
  SearchableDropdown,
  SearchableDropdownOption,
} from "@/components/ui/searchable-dropdown";

interface TalentOrderDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SearchableDropdownOption[];
}

export function TalentOrderDropdown({
  value = "Recruiting board",
  onChange,
  options,
}: TalentOrderDropdownProps) {
  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-8 py-0!">
      <span className="text-xs text-muted-foreground">Talent Order</span>
      <SearchableDropdown
        value={value}
        options={options}
        onChange={onChange}
        placeholder="Select order"
        searchPlaceholder="Search order..."
        emptyMessage="No talent orders found."
        triggerClassName="border-transparent px-2 shadow-none bg-transparent! h-7 text-xs font-normal hover:bg-transparent focus:ring-0 focus:ring-offset-0"
      />
    </div>
  );
}
