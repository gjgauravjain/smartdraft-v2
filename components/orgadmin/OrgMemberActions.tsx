"use client";

import { useState } from "react";
import { OrgMemberType, PendingAction } from "@/app/api/type/org-admin";
import { DotsIcon } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Shield, Unlink } from "lucide-react";
import { OrgMemberActionsSheet } from "./OrgMemberActionsSheet";
import { getMemberFullName, isOrgAdminMember } from "./util";

type OrgMemberActionsProps = {
  member: OrgMemberType;
  orgName: string;
  isOwnRow: boolean;
  isUpdating: boolean;
  onMakeAdmin: (member: OrgMemberType) => void;
  onRevokeAdmin: (member: OrgMemberType) => void;
  onRemove: (member: OrgMemberType) => void;
};

export const OrgMemberActions = ({
  member,
  orgName,
  isOwnRow,
  isUpdating,
  onMakeAdmin,
  onRevokeAdmin,
  onRemove,
}: OrgMemberActionsProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const isAdmin = isOrgAdminMember(member);
  const memberName = getMemberFullName(member);

  const closeMenu = () => {
    setOpen(false);
    setPendingAction(null);
  };

  const handleConfirm = () => {
    if (pendingAction === "make_admin") {
      onMakeAdmin(member);
    }
    if (pendingAction === "revoke_admin") {
      onRevokeAdmin(member);
    }
    if (pendingAction === "remove") {
      onRemove(member);
    }

    closeMenu();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPendingAction(null);
    }
  };

  const triggerButton = (
    <button
      type="button"
      disabled={isOwnRow || isUpdating}
      className={cn(
        "inline-flex rounded-md p-[3px] text-muted-foreground transition-colors",
        isOwnRow || isUpdating
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer hover:text-foreground",
      )}
      onClick={(event) => {
        event.stopPropagation();
        if (isMobile && !isOwnRow && !isUpdating) {
          setOpen(true);
        }
      }}
    >
      <DotsIcon />
    </button>
  );

  if (isOwnRow) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{triggerButton}</span>
        </TooltipTrigger>
        <TooltipContent side="left">
          You cannot modify your own access
        </TooltipContent>
      </Tooltip>
    );
  }

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <OrgMemberActionsSheet
          open={open}
          onClose={closeMenu}
          member={member}
          orgName={orgName}
          isUpdating={isUpdating}
          pendingAction={pendingAction}
          onPendingActionChange={setPendingAction}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        {pendingAction ? (
          <div className="p-2">
            <p className="text-[12px] font-semibold text-foreground">
              {pendingAction === "make_admin" && "Make org admin?"}
              {pendingAction === "revoke_admin" && "Revoke org admin?"}
              {pendingAction === "remove" && "Remove from organisation?"}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {pendingAction === "make_admin" &&
                `${memberName} will be able to manage members for ${orgName}.`}
              {pendingAction === "revoke_admin" &&
                `${memberName} will lose org admin access for ${orgName}.`}
              {pendingAction === "remove" &&
                `${memberName} will lose access to ${orgName}. Their account and other org memberships are unaffected.`}
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[11px]"
                onClick={() => setPendingAction(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 text-[11px]"
                variant={pendingAction === "remove" ? "destructive" : "default"}
                disabled={isUpdating}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-[12px] text-foreground hover:bg-muted"
              onClick={() =>
                setPendingAction(isAdmin ? "revoke_admin" : "make_admin")
              }
            >
              <Shield className="mr-2 h-3 w-3" />
              {isAdmin ? "Revoke org admin" : "Make org admin"}
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-[12px] text-destructive hover:bg-muted"
              onClick={() => setPendingAction("remove")}
            >
              <Unlink className="mr-2 h-3 w-3" /> Remove from organisation
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
