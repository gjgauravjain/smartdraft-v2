"use client";

import * as React from "react";
import { Check, Search } from "lucide-react";
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
  icon?: React.ReactNode;
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
  label?: string;
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
  label,
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

  const isLabeledPill = Boolean(label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          title={label}
          className={cn(
            "h-auto w-full max-w-56 flex-col items-start justify-center gap-0 overflow-hidden rounded-[5px] px-[9px] py-[3px] leading-[1.15] shadow-none",
            isLabeledPill
              ? cn(
                  "border border-primary/20 bg-primary-light dark:bg-primary dark:text-white text-primary",
                  "hover:bg-primary/10 hover:text-primary",
                  "data-[state=open]:border-primary data-[state=open]:bg-primary data-[state=open]:text-primary-foreground",
                  "data-[state=open]:hover:bg-primary data-[state=open]:hover:text-primary-foreground",
                )
              : cn(
                  "border border-border bg-card text-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "data-[state=open]:border-border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                ),
            className,
            triggerClassName,
          )}
        >
          {label ? (
            <span className="w-auto truncate text-[7.5px] font-bold uppercase tracking-[0.7px] opacity-70">
              {label}
            </span>
          ) : null}
          <span className="relative flex w-full min-w-0 items-center gap-[5px]">
            {showStatusDot ? (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            ) : null}
            <p className="min-w-0 flex-1 truncate text-left text-[11.5px] font-bold whitespace-nowrap">
              {selectedOption?.label ?? placeholder}
            </p>
            <span className="absolute right-0 shrink-0 text-[9px] opacity-80">
              ▾
            </span>
          </span>
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
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                </div>

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
