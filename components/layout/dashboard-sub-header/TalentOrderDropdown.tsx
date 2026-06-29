"use client";

import { useState } from "react";
import {
  SearchableDropdown,
  SearchableDropdownOption,
} from "@/components/ui/searchable-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFilterPill } from "@/components/common/MobileFilterPill";
import { BottomSheet } from "@/components/common/BottomSheet";
import { BottomSheetOption } from "@/components/common/BottomSheetOption";
import { ListOrderedIcon } from "lucide-react";

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
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? value;

  if (isMobile) {
    return (
      <>
        <MobileFilterPill
          eyebrow="Talent board"
          value={selectedLabel}
          active={false}
          onClick={() => setSheetOpen(true)}
        />
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Switch talent board"
          subtitle={selectedLabel}
        >
          <div className="flex flex-col gap-1.5 px-3 py-2.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <BottomSheetOption
                  key={option.value}
                  label={option.label}
                  icon={<ListOrderedIcon />}
                  selected={isSelected}
                  onClick={() => {
                    onChange?.(option.value);
                    setSheetOpen(false);
                  }}
                />
              );
            })}
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-8 py-0!">
      <SearchableDropdown
        value={value}
        options={options}
        onChange={onChange}
        placeholder="Select order"
        searchPlaceholder="Search order..."
        emptyMessage="No talent orders found."
        triggerClassName="border-transparent  max-w-[118px]! px-2 shadow-none bg-transparent! h-7 text-xs font-normal hover:bg-transparent focus:ring-0 focus:ring-offset-0"
      />
    </div>
  );
}
