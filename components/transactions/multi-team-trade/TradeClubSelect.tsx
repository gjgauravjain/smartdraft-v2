"use client";

import { SelectOption } from "@/components/common/fields/FormSelectField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TradeClubFlag } from "./TradeClubFlag";
import { TeamType } from "@/app/api/type/common";

export const TradeClubSelect = ({
  value,
  options,
  teamsById,
  disabledValues,
  disabled,
  onChange,
}: {
  value: string;
  options: SelectOption[];
  teamsById: Map<string, TeamType>;
  disabledValues?: Set<string>;
  disabled?: boolean;
  onChange: (value: string) => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalized),
    );
  }, [options, search]);

  const selectedTeam = value ? teamsById.get(value) : undefined;

  return (
    <Select
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) setSearch("");
      }}
    >
      <SelectTrigger
        className={cn(
          "h-[38px] w-full rounded-lg border-border bg-card px-[11px] text-[13px] shadow-none",
          !value && "text-muted-foreground",
        )}
      >
        <span className="flex! min-w-0 flex-1 items-center gap-2">
          <TradeClubFlag team={selectedTeam} />
          <span
            className={cn(
              "truncate font-semibold",
              value ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selectedTeam?.teamNames ?? "Select club…"}
          </span>
        </span>
      </SelectTrigger>
      <SelectContent className="h-auto max-h-72">
        <div className="sticky -top-2.5 z-10 -mx-1 -mt-1 mb-1 border-b border-border bg-popover px-2 pb-1.5 pt-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.stopPropagation()}
              placeholder="Search clubs…"
              className="h-8 pl-7 text-xs"
              autoFocus
            />
          </div>
        </div>
        {filteredOptions.length ? (
          filteredOptions.map((option) => {
            const taken =
              disabledValues?.has(option.value) && option.value !== value;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={taken}
              >
                <span className="flex items-center gap-2">
                  <TradeClubFlag team={teamsById.get(option.value)} />
                  <span>{option.label}</span>
                </span>
              </SelectItem>
            );
          })
        ) : (
          <div className="px-2 py-4 text-center text-xs text-muted-foreground">
            {search ? "No matches found." : "No clubs available."}
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
