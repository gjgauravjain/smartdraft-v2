"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileFilterPillProps {
  eyebrow: string;
  value: string;
  active?: boolean;
  onClick: () => void;
  className?: string;
}

export function MobileFilterPill({
  eyebrow,
  value,
  active = true,
  onClick,
  className,
}: MobileFilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-start gap-px rounded-lg border px-[11px] py-[5px] text-left",
        active ? "border-primary bg-primary" : "border-border bg-card",
        className,
      )}
    >
      <span
        className={cn(
          "text-[8.5px] font-bold uppercase tracking-[0.7px]",
          active
            ? "text-primary/75 dark:text-white/75"
            : "text-muted-foreground",
        )}
      >
        {eyebrow}
      </span>
      <span className="flex w-full items-center gap-1.5">
        <span
          className={cn(
            "flex-1 truncate text-[12.5px] font-bold",
            active ? "text-primary dark:text-white" : "text-foreground",
          )}
        >
          {value}
        </span>
        <ChevronDown
          className={cn(
            "h-2.5 w-2.5 shrink-0",
            active ? "text-primary" : "text-muted-foreground",
          )}
        />
      </span>
    </button>
  );
}
