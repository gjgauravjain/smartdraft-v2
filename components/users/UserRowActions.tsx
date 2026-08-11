"use client";

import { useState } from "react";
import { Pencil, Shield, UserX } from "lucide-react";
import { UserListType } from "@/app/api/type/user";
import { DotsIcon } from "@/components/common/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const MENU_DISABLED_TOOLTIP =
  "Available once user updates are enabled";

type UserRowActionsProps = {
  user: UserListType;
};

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
};

function DisabledMenuItem({ icon, label, destructive }: MenuItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block w-full">
          <button
            type="button"
            disabled
            className={cn(
              "flex w-full cursor-not-allowed items-center rounded-sm px-2 py-1.5 text-left text-[12px] opacity-50",
              destructive ? "text-destructive" : "text-foreground",
            )}
          >
            <span className="mr-2 inline-flex h-3 w-3 shrink-0 items-center justify-center">
              {icon}
            </span>
            {label}
          </button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="left">{MENU_DISABLED_TOOLTIP}</TooltipContent>
    </Tooltip>
  );
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${user.firstName} ${user.lastName}`}
          className="inline-flex cursor-pointer rounded p-1 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
          onClick={(event) => event.stopPropagation()}
        >
          <DotsIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        <DisabledMenuItem
          icon={<Pencil className="h-3 w-3" strokeWidth={1.8} />}
          label="Edit user"
        />
        <DisabledMenuItem
          icon={<Shield className="h-3 w-3" strokeWidth={1.8} />}
          label="Change tier"
        />
        <DisabledMenuItem
          icon={<UserX className="h-3 w-3" strokeWidth={1.8} />}
          label="Deactivate account"
          destructive
        />
      </PopoverContent>
    </Popover>
  );
}
