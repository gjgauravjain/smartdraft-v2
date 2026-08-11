"use client";

import { useEffect, useMemo, useState } from "react";
import { Info, UserRoundPlus, X } from "lucide-react";
import { useGetAllUsers } from "@/app/api/react-query/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getInitials } from "@/lib/utils";
import { getUserFullName, getUserOrganisations } from "@/components/users/util";
import { formatUserOrgSummary } from "./util";

type AddExistingUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  orgName: string;
  existingMemberIds: number[];
  isSubmitting?: boolean;
  onAdd: (payload: { userId: number; isOrgAdmin: boolean }) => void;
};

export function AddExistingUserDialog({
  open,
  onOpenChange,
  orgId,
  orgName,
  existingMemberIds,
  isSubmitting,
  onAdd,
}: AddExistingUserDialogProps) {
  const isMobile = useIsMobile();
  const { data: users = [], isLoading } = useGetAllUsers();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedUserId(null);
      setIsOrgAdmin(false);
    }
  }, [open]);

  const candidateUsers = useMemo(() => {
    const memberIdSet = new Set(
      existingMemberIds.map((id) => id.toString()).filter((id) => id !== "NaN"),
    );
    const query = search.trim().toLowerCase();

    return users
      .filter((user) => {
        if (memberIdSet.has(user.id.toString())) {
          return false;
        }

        const alreadyInOrg = getUserOrganisations(user).some(
          (org) => org.organisationId.toString() === orgId.toString(),
        );

        return !alreadyInOrg;
      })
      .filter((user) => {
        if (!query) {
          return true;
        }

        const fullName = getUserFullName(user).toLowerCase();
        return (
          fullName.includes(query) || user.email.toLowerCase().includes(query)
        );
      })
      .slice(0, 20);
  }, [users, existingMemberIds, orgId, search]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const handleAdd = () => {
    if (!selectedUserId) {
      return;
    }

    onAdd({ userId: selectedUserId, isOrgAdmin });
  };

  const title = isMobile
    ? "Add existing user"
    : `Add existing user to ${orgName}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(8,12,20,0.42)]"
        className={cn(
          "flex flex-col gap-0 overflow-hidden border-border bg-card p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] [&>button]:hidden",
          "max-w-[560px] max-h-[716px] rounded-[14px]",
          "sm:top-[64px] sm:translate-y-0",
          "sm:data-[state=open]:slide-in-from-top-2 sm:data-[state=closed]:slide-out-to-top-2",
          "max-sm:max-w-none max-sm:w-full max-sm:h-[100dvh]",
          "max-sm:max-h-[100dvh] max-sm:rounded-none",
          "max-sm:m-0 max-sm:translate-x-0 max-sm:translate-y-0",
          "max-sm:top-0 max-sm:left-0 max-sm:inset-0",
        )}
      >
        {isMobile && <div className="h-[3px] bg-primary shrink-0" />}

        <DialogHeader
          className={[
            "border-b border-border space-y-0 shrink-0",
            isMobile
              ? "flex-row items-center px-4 py-3"
              : "flex-row items-center gap-3 px-5 py-[17px]",
          ].join(" ")}
        >
          {isMobile ? (
            <>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-[46px] text-left text-[14px] font-semibold text-muted-foreground bg-transparent border-0 p-0 cursor-pointer"
              >
                Cancel
              </button>
              <DialogTitle className="flex-1 text-center text-[15.5px] font-bold text-foreground">
                {title}
              </DialogTitle>
              <span className="w-[46px]" />
            </>
          ) : (
            <>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary">
                <UserRoundPlus
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.8}
                />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <DialogTitle className="text-[15.5px] font-bold text-foreground">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-px text-xs text-muted-foreground">
                  Any account on the platform · access is immediate
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
            </>
          )}
        </DialogHeader>

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-[15px] overflow-auto",
            isMobile ? "p-4" : "p-5",
          )}
        >
          {isMobile && (
            <p className="text-[12px] text-muted-foreground">
              Any account on the platform · access is immediate
            </p>
          )}

          <div>
            <label className="mb-1.5 block text-[11.5px] font-bold text-foreground">
              Find user
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search all users by name or email"
              className="w-full rounded-[7px] border border-border bg-muted px-[11px] py-[9px] text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-auto rounded-[9px] border border-border">
            {isLoading ? (
              <div className="px-[13px] py-6 text-center text-[12px] text-muted-foreground">
                Loading users…
              </div>
            ) : candidateUsers.length === 0 ? (
              <div className="px-[13px] py-6 text-center text-[12px] text-muted-foreground">
                {search.trim()
                  ? "No matching users found"
                  : "No users available to add"}
              </div>
            ) : (
              candidateUsers.map((user, index) => {
                const fullName = getUserFullName(user);
                const isSelected = selectedUserId === user.id;
                const isLast = index === candidateUsers.length - 1;

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-[11px] px-[13px] py-2.5",
                      !isLast && "border-b border-table-row-border",
                      isSelected ? "bg-muted" : "bg-transparent",
                    )}
                  >
                    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-primary text-[11.4px] font-bold text-primary-foreground">
                      {getInitials(fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-foreground">
                        {fullName}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {user.email} · {formatUserOrgSummary(user)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-auto rounded-[6px] px-[11px] py-1.5 text-[11.5px] font-semibold",
                        isSelected &&
                          "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                      )}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between rounded-[9px] border border-border bg-muted px-[13px] py-3">
            <div>
              <div className="text-[12.5px] font-bold text-foreground">
                Org admin on {orgName}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Can manage this club’s members
              </div>
            </div>
            <Switch
              checked={isOrgAdmin}
              onCheckedChange={setIsOrgAdmin}
              aria-label={`Org admin on ${orgName}`}
              className="h-5 w-[34px] data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted data-[state=unchecked]:border data-[state=unchecked]:border-border"
            />
          </div>

          <div className="flex items-start gap-[9px] rounded-lg border border-primary/20 bg-primary/10 px-[13px] py-[11px]">
            <Info
              className="mt-px h-[15px] w-[15px] shrink-0 text-primary"
              strokeWidth={1.8}
            />
            <span className="text-xs leading-normal text-primary">
              Added users are <strong className="font-bold">Active</strong>{" "}
              immediately — no invitation step, no set-password email.
            </span>
          </div>
        </div>

        {isMobile ? (
          <div className="px-4 pb-[26px] pt-3 border-t border-border shrink-0">
            <button
              type="button"
              disabled={!selectedUser || isSubmitting}
              onClick={handleAdd}
              className="w-full py-[13px] bg-primary text-primary-foreground rounded-[10px] text-[14.5px] font-bold border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding…" : "Add to organisation"}
            </button>
          </div>
        ) : (
          <DialogFooter className="border-t border-border px-5 py-3.5 sm:justify-end">
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
              disabled={!selectedUser || isSubmitting}
              className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
              onClick={handleAdd}
            >
              {isSubmitting ? "Adding…" : "Add to organisation"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
