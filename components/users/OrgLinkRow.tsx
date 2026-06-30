"use client";

import { Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrgLinkRowProps {
  label: string;
  shortCode: string;
  onRemove: () => void;
  isLast?: boolean;
}

export function OrgLinkRow({
  label,
  shortCode,
  onRemove,
  isLast,
}: OrgLinkRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-[13px] py-[11px]",
        !isLast && "border-b border-border/70",
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6.72px] border border-border bg-secondary font-sans text-[10.64px] font-bold tracking-[0.3px] text-muted-foreground">
        {shortCode}
      </div>
      <span className="flex-1 text-[13px] font-semibold text-foreground">
        {label}
      </span>
      <button
        type="button"
        title="Remove org"
        onClick={onRemove}
        className="flex shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Unlink className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}
