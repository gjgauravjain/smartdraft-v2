"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetOptionProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function BottomSheetOption({
  label,
  description,
  icon,
  selected,
  disabled,
  onClick,
}: BottomSheetOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={selected}
      className={cn(
        "flex w-full items-center gap-[11px] rounded-[11px] border px-[13px] py-3 text-left",
        selected
          ? "border-primary/20 bg-primary/[0.08]"
          : "border-border bg-card",
        disabled && "opacity-60",
      )}
    >
      <span
        className={cn(
          "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-sm font-bold",
            selected ? "text-primary dark:text-accent" : "text-foreground",
          )}
        >
          {label}
        </div>
        {description && (
          <div className="mt-px text-[11px] text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {selected && (
        <Check className="h-[15px] w-[15px] shrink-0 stroke-[3] text-primary" />
      )}
    </button>
  );
}
