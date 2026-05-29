"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type SearchableDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface SearchableDropdownProps {
  options: SearchableDropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showStatusDot?: boolean;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  disabled,
  className,
  triggerClassName,
  contentClassName,
  showStatusDot,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = normalizedSearch
    ? options.filter((option) =>
        option.label.toLowerCase().includes(normalizedSearch),
      )
    : options;

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-7 max-w-56 justify-between gap-1.5 px-3 text-xs font-semibold rounded-sm! dark:bg-primary dark:text-white",
            className,
            triggerClassName,
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {showStatusDot ? (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            ) : null}
            <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-64 p-1", contentClassName)}
      >
        <div className="relative mb-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 pl-7 text-xs"
          />
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                  option.value === value && "bg-accent/60",
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value ? (
                  <Check className="ml-2 h-3.5 w-3.5 shrink-0" />
                ) : null}
              </button>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-xs text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
