"use client";

import { ArrowRight, Shield, X } from "lucide-react";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrgMemberAvatar } from "./OrgMemberAvatar";
import { getMemberFullName } from "./util";

export type OrgAdminRoleDialogMode = "make" | "revoke";

type MakeOrgAdminDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: OrgMemberType;
  orgName: string;
  mode: OrgAdminRoleDialogMode;
  isUpdating?: boolean;
  onConfirm: () => void;
};

const MemberBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-[9px] py-0.5 text-[10.5px] font-semibold whitespace-nowrap text-muted-foreground">
    Member
  </span>
);

const OrgAdminBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-[9px] py-0.5 text-[10.5px] font-bold whitespace-nowrap text-primary">
    <Shield className="h-2.5 w-2.5" strokeWidth={1.8} />
    Org admin
  </span>
);

export function MakeOrgAdminDialog({
  open,
  onOpenChange,
  member,
  orgName,
  mode,
  isUpdating,
  onConfirm,
}: MakeOrgAdminDialogProps) {
  const memberName = getMemberFullName(member);
  const isRevoke = mode === "revoke";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(8,12,20,0.42)]"
        className="flex max-h-[716px] w-full max-w-[470px] flex-col gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] [&>button]:hidden"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-[17px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary">
            <Shield className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-[15.5px] font-bold text-foreground">
              {isRevoke ? "Revoke org admin" : "Make org admin"}
            </DialogTitle>
            <DialogDescription className="mt-px text-xs text-muted-foreground">
              {memberName} · {orgName}
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] border border-border bg-card text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-[15px] w-[15px]" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 px-5 py-[18px]">
          <p className="text-[13px] leading-[1.55] text-muted-foreground">
            {isRevoke ? (
              <>
                <strong className="font-semibold text-foreground">
                  {memberName}
                </strong>{" "}
                will lose org admin access for{" "}
                <strong className="font-semibold text-foreground">
                  {orgName}
                </strong>
                . They will remain a member and keep access to this organisation.
              </>
            ) : (
              <>
                Org admins can add, edit and remove members of{" "}
                <strong className="font-semibold text-foreground">
                  {orgName}
                </strong>
                . It changes nothing in any other organisation and grants no
                platform access.
              </>
            )}
          </p>

          <div className="flex items-center gap-2.5 rounded-[9px] border border-border bg-muted px-[13px] py-[11px]">
            <OrgMemberAvatar member={member} size={30} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-foreground">
                {memberName}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {member.email}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2">
              {isRevoke ? <OrgAdminBadge /> : <MemberBadge />}
              <ArrowRight
                className="h-3 w-3 text-muted-foreground/60"
                strokeWidth={1.8}
              />
              {isRevoke ? <MemberBadge /> : <OrgAdminBadge />}
            </span>
          </div>

          <div className="flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isUpdating}
              className="h-auto gap-1.5 rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
              onClick={onConfirm}
            >
              <Shield className="h-[13px] w-[13px]" strokeWidth={1.8} />
              {isRevoke ? "Revoke org admin" : "Make org admin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
