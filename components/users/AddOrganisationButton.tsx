"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrganisationListType } from "@/app/api/type/organisation";

type AddOrganisationButtonProps = {
  options: OrganisationListType[];
  onSelect: (orgId: string) => void;
};

export function AddOrganisationButton({
  options,
  onSelect,
}: AddOrganisationButtonProps) {
  const [open, setOpen] = useState(false);
  const isEmpty = options.length === 0;

  return (
    <div className="mt-[9px]">
      <Popover open={open} onOpenChange={isEmpty ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isEmpty}
            className="flex w-full items-center justify-center gap-1.5 rounded-[7px] border border-dashed border-border bg-transparent px-3 py-2 font-sans text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Link2 className="h-[13px] w-[13px]" strokeWidth={1.8} />
            Add another organisation
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[--radix-popover-trigger-width] p-1"
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => {
                  onSelect(org.id);
                  setOpen(false);
                }}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-[13px] outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <span className="truncate">{org.name}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
