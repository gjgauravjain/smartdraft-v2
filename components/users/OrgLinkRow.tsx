"use client";

import { Unlink } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface OrgLinkRowProps {
  label: string;
  shortCode: string;
  isOrgAdmin: boolean;
  onOrgAdminChange: (isOrgAdmin: boolean) => void;
  onRemove: () => void;
  isLast?: boolean;
}

export function OrgLinkRow({
  label,
  shortCode,
  isOrgAdmin,
  onOrgAdminChange,
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
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6.72px] border border-border bg-secondary font-sans text-[10.64px] font-bold tracking-[0.3px] text-muted-foreground">
            {getInitials(shortCode || label)}
          </div>
        </TooltipTrigger>
        <TooltipContent>{shortCode || label}</TooltipContent>
      </Tooltip>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-foreground">
          {label}
        </span>
        <span className="mt-px block text-[10.5px] text-muted-foreground">
          {isOrgAdmin
            ? "Can manage this club’s members"
            : "Standard member of this club"}
        </span>
      </span>

      <span className="inline-flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "text-[11px] font-bold",
            isOrgAdmin ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Org admin
        </span>
        <Switch
          checked={isOrgAdmin}
          onCheckedChange={onOrgAdminChange}
          aria-label={`Org admin for ${label}`}
          className="h-5 w-[34px] data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted data-[state=unchecked]:border data-[state=unchecked]:border-border"
        />
      </span>

      <button
        type="button"
        title="Remove org"
        onClick={onRemove}
        className="ml-1 flex shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Unlink className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}
