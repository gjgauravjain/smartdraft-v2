"use client";

import { SearchableDropdown } from "@/components/ui/searchable-dropdown";

export const TALENT_ORDER_OPTIONS = [
  { value: "Recruiting board", label: "Recruiting board" },
  { value: "Big board", label: "Big board" },
  { value: "Position rank", label: "Position rank" },
  { value: "Class rank", label: "Class rank" },
];

interface TalentOrderDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TalentOrderDropdown({
  value = "Recruiting board",
  onChange,
}: TalentOrderDropdownProps) {
  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-8 py-0!">
      <span className="text-xs text-muted-foreground">Talent Order</span>
      <SearchableDropdown
        value={value}
        options={TALENT_ORDER_OPTIONS}
        onChange={onChange}
        placeholder="Select order"
        searchPlaceholder="Search order..."
        emptyMessage="No talent orders found."
        triggerClassName="border-transparent px-2 shadow-none bg-transparent! h-7 text-xs font-normal hover:bg-transparent focus:ring-0 focus:ring-offset-0"
      />
    </div>
  );
}
