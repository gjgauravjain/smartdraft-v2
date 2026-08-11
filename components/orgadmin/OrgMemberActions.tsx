"use client";

import { useState } from "react";
import {
  OrgMemberType,
  PendingAction,
  PendingActionEnum,
} from "@/app/api/type/org-admin";
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
import {
  MakeOrgAdminDialog,
  OrgAdminRoleDialogMode,
} from "./MakeOrgAdminDialog";
import { OrgMemberActionsSheet } from "./OrgMemberActionsSheet";
import { getMemberFullName, isOrgAdminMember } from "./util";

type SheetPendingAction = Extract<PendingAction, "remove"> | null;

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
  const [pendingAction, setPendingAction] = useState<SheetPendingAction>(null);
  const [roleDialogMode, setRoleDialogMode] =
    useState<OrgAdminRoleDialogMode | null>(null);
  const isAdmin = isOrgAdminMember(member);
  const memberName = getMemberFullName(member);

  const closeMenu = () => {
    setOpen(false);
    setPendingAction(null);
  };

  const openRoleDialog = (mode: OrgAdminRoleDialogMode) => {
    closeMenu();
    setRoleDialogMode(mode);
  };

  const handleConfirm = () => {
    if (pendingAction === PendingActionEnum.REMOVE) {
      onRemove(member);
    }

    closeMenu();
  };

  const handleRoleDialogConfirm = () => {
    if (roleDialogMode === "make") {
      onMakeAdmin(member);
    }
    if (roleDialogMode === "revoke") {
      onRevokeAdmin(member);
    }
    setRoleDialogMode(null);
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

  const roleDialog = (
    <MakeOrgAdminDialog
      open={roleDialogMode !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setRoleDialogMode(null);
        }
      }}
      member={member}
      orgName={orgName}
      mode={roleDialogMode ?? "make"}
      isUpdating={isUpdating}
      onConfirm={handleRoleDialogConfirm}
    />
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
          onMakeAdminClick={() => openRoleDialog("make")}
          onRevokeAdminClick={() => openRoleDialog("revoke")}
          onConfirm={handleConfirm}
        />
        {roleDialog}
      </>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-1">
          {pendingAction ? (
            <div className="p-2">
              <p className="text-[12px] font-semibold text-foreground">
                Remove from organisation?
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {`${memberName} will lose access to ${orgName}. Their account and other org memberships are unaffected.`}
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
                  variant="destructive"
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
                onClick={() => openRoleDialog(isAdmin ? "revoke" : "make")}
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
      {roleDialog}
    </>
  );
};
