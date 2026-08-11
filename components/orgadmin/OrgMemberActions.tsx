"use client";

import { useState } from "react";
import {
  OrgAdminRoleDialogMode,
  OrgAdminRoleDialogModeEnum,
  OrgMemberType,
} from "@/app/api/type/org-admin";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Shield, Unlink } from "lucide-react";
import { MakeOrgAdminDialog } from "./MakeOrgAdminDialog";
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
  const [removeOpen, setRemoveOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] =
    useState<OrgAdminRoleDialogMode | null>(null);
  const isAdmin = isOrgAdminMember(member);
  const memberName = getMemberFullName(member);

  const closeMenu = () => {
    setOpen(false);
  };

  const openRoleDialog = (mode: OrgAdminRoleDialogMode) => {
    closeMenu();
    setRoleDialogMode(mode);
  };

  const openRemoveDialog = () => {
    closeMenu();
    setRemoveOpen(true);
  };

  const handleRoleDialogConfirm = () => {
    if (roleDialogMode === "make") {
      onMakeAdmin(member);
    }
    if (roleDialogMode === OrgAdminRoleDialogModeEnum.REVOKE) {
      onRevokeAdmin(member);
    }
    setRoleDialogMode(null);
  };

  const handleRemoveConfirm = () => {
    onRemove(member);
    setRemoveOpen(false);
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

  const dialogs = (
    <>
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
      <ConfirmDangerDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title="Remove from organisation"
        subtitle={`${memberName} · ${orgName}`}
        description={`${memberName} will lose access to ${orgName}. Their account and other org memberships are unaffected.`}
        actionLabel="Remove from organisation"
        isLoading={isUpdating}
        onConfirm={handleRemoveConfirm}
      />
    </>
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
          onMakeAdminClick={() => openRoleDialog("make")}
          onRevokeAdminClick={() => openRoleDialog("revoke")}
          onRemoveClick={openRemoveDialog}
        />
        {dialogs}
      </>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-1">
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
            onClick={openRemoveDialog}
          >
            <Unlink className="mr-2 h-3 w-3" /> Remove from organisation
          </button>
        </PopoverContent>
      </Popover>
      {dialogs}
    </>
  );
};
