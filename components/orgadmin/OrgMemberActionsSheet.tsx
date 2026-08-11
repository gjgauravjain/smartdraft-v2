"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shield, Unlink } from "lucide-react";
import { OrgMemberAvatar } from "./OrgMemberAvatar";
import {
  getMemberFullName,
  getMemberSummarySubtitle,
  isOrgAdminMember,
} from "./util";

type PendingAction = "remove" | null;

type OrgMemberActionsSheetProps = {
  open: boolean;
  onClose: () => void;
  member: OrgMemberType;
  orgName: string;
  isUpdating: boolean;
  pendingAction: PendingAction;
  onPendingActionChange: (action: PendingAction) => void;
  onMakeAdminClick: () => void;
  onRevokeAdminClick: () => void;
  onConfirm: () => void;
};

export const OrgMemberActionsSheet = ({
  open,
  onClose,
  member,
  orgName,
  isUpdating,
  pendingAction,
  onPendingActionChange,
  onMakeAdminClick,
  onRevokeAdminClick,
  onConfirm,
}: OrgMemberActionsSheetProps) => {
  const [mounted, setMounted] = useState(false);
  const isAdmin = isOrgAdminMember(member);
  const memberName = getMemberFullName(member);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[60] flex flex-col justify-end",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[rgba(8,12,20,0.5)] transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Actions for ${memberName}`}
        className={cn(
          "relative bg-card border-t border-border rounded-t-[18px] px-3.5 pt-2 pb-[26px] transition-transform duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="w-[38px] h-1 rounded-full bg-border mx-auto mb-3" />

        {pendingAction ? (
          <div className="px-1">
            <p className="text-[15px] font-bold text-foreground">
              Remove from organisation?
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              {`${memberName} will lose access to ${orgName}. Their account and other org memberships are unaffected.`}
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Button
                type="button"
                className="w-full h-11 rounded-[10px] text-sm font-semibold"
                variant="destructive"
                disabled={isUpdating}
                onClick={onConfirm}
              >
                Confirm
              </Button>
              <button
                type="button"
                onClick={() => onPendingActionChange(null)}
                className="w-full py-[13px] rounded-[10px] border border-border bg-table-header text-sm font-semibold text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-[11px] px-1 pb-3.5 border-b border-table-row-border">
              <OrgMemberAvatar member={member} size={40} />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-foreground truncate">
                  {memberName}
                </div>
                <div className="text-[11.5px] text-muted-foreground">
                  {getMemberSummarySubtitle(member)}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center gap-3 px-1 py-[15px] border-b border-table-row-border text-left"
              onClick={() => {
                if (isAdmin) {
                  onRevokeAdminClick();
                  return;
                }
                onMakeAdminClick();
              }}
            >
              <Shield
                className="h-[18px] w-[18px] text-muted-foreground"
                strokeWidth={1.8}
              />
              <span className="text-sm font-semibold text-foreground">
                {isAdmin ? "Revoke org admin" : "Make org admin"}
              </span>
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 px-1 py-[15px] text-left"
              onClick={() => onPendingActionChange("remove")}
            >
              <Unlink
                className="h-[18px] w-[18px] text-[rgb(180,35,42)]"
                strokeWidth={1.8}
              />
              <span className="text-sm font-semibold text-[rgb(180,35,42)]">
                Remove from organisation
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-3.5 w-full py-[13px] rounded-[10px] border border-border bg-table-header text-sm font-semibold text-muted-foreground"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};
