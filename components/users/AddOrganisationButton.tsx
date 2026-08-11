"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrganisationListType } from "@/app/api/type/organisation";
import { cn, getInitials } from "@/lib/utils";
import { normalizeOrgId, orgIdsMatch } from "./util";

type AddOrganisationButtonProps = {
  organisations: OrganisationListType[];
  linkedOrgIds: string[];
  onSelect: (orgId: string | number) => void;
};

export function AddOrganisationButton({
  organisations,
  linkedOrgIds,
  onSelect,
}: AddOrganisationButtonProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isEmpty = organisations.length === 0;

  const filteredOrgs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return organisations;
    }

    return organisations.filter((org) => {
      const name = org.name.toLowerCase();
      const code = org.sportingCode?.code?.toLowerCase() ?? "";
      const sportingName = org.sportingCode?.name?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        code.includes(query) ||
        sportingName.includes(query)
      );
    });
  }, [organisations, search]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setHoveredId(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div className="relative mt-[9px]">
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (isEmpty) {
            return;
          }
          setOpen(next);
        }}
      >
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
          sideOffset={8}
          className="w-[--radix-popover-trigger-width] rounded-[10px] border-border bg-card p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.16)]"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="px-1.5 pb-2 pt-1">
            <input
              ref={searchInputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search organisations…"
              className="w-full rounded-[7px] border border-border bg-muted px-[11px] py-[9px] text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredOrgs.length === 0 ? (
              <div className="px-2 py-3 text-center text-[12px] text-muted-foreground">
                No organisations found
              </div>
            ) : (
              filteredOrgs.map((org) => {
                const orgId = normalizeOrgId(org.id);
                const isLinked = linkedOrgIds.some((id) =>
                  orgIdsMatch(id, orgId),
                );
                const isHovered = hoveredId === orgId && !isLinked;
                const initials = getInitials(org.name);
                const metaLabel = isLinked
                  ? "Linked"
                  : (org.sportingCode?.code ??
                    org.sportingCode?.name ??
                    "");

                return (
                  <button
                    key={org.id}
                    type="button"
                    disabled={isLinked}
                    onMouseEnter={() => setHoveredId(orgId)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => {
                      if (isLinked) {
                        return;
                      }
                      onSelect(orgId);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-[7px] px-2 py-2 text-left outline-none",
                      isLinked
                        ? "cursor-default opacity-45"
                        : "cursor-pointer",
                      isHovered && "bg-muted",
                    )}
                  >
                    <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6.24px] border border-border bg-secondary text-[9.88px] font-bold tracking-[0.3px] text-muted-foreground">
                      {initials}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-foreground">
                      {org.name}
                    </span>
                    <span className="shrink-0 text-[10.5px] text-muted-foreground">
                      {metaLabel}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
