import { Shield } from "lucide-react";
import { UserListType } from "@/app/api/type/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TierValue } from "./types";

type ChangeTierDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListType;
  selectedTier: TierValue;
  isPending: boolean;
  wouldRemoveLastSuperAdmin: boolean;
  onSelectTier: (tier: TierValue) => void;
  onSave: () => void;
};

const TIER_OPTIONS = [
  {
    value: "super_admin" as const,
    label: "Super Admin",
    description:
      "Sees every organisation, every user and every tier on the platform.",
  },
  {
    value: "standard" as const,
    label: "Standard",
    description:
      "Sees only the organisations they belong to. Keeps their org admin roles.",
  },
];

export function ChangeTierDialog({
  open,
  onOpenChange,
  user,
  selectedTier,
  isPending,
  wouldRemoveLastSuperAdmin,
  onSelectTier,
  onSave,
}: ChangeTierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:rounded-[14px]">
        <DialogHeader className="flex-row items-center gap-3 border-b border-border px-5 py-[17px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary">
            <Shield className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <DialogTitle className="text-[15.5px] font-bold text-foreground">
              Change platform tier
            </DialogTitle>
            <DialogDescription className="mt-px text-xs text-muted-foreground">
              {user.firstName} {user.lastName} - {user.email}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-5 py-5">
          {TIER_OPTIONS.map((option) => {
            const selected = selectedTier === option.value;
            const current =
              option.value === (user.isSuperuser ? "super_admin" : "standard");

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelectTier(option.value)}
                className={cn(
                  "flex gap-3 rounded-[10px] border p-3.5 text-left transition-colors",
                  selected
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-card hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    selected
                      ? "border-primary bg-primary"
                      : "border-text4 bg-transparent",
                  )}
                >
                  {selected ? (
                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                  ) : null}
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[13.5px] font-bold text-foreground">
                      {option.label}
                    </span>
                    {current ? (
                      <span className="text-[10px] font-bold tracking-[0.4px] text-text4">
                        CURRENT
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-[12px] leading-[1.5] text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 border-t border-border px-5 py-3.5">
          <label className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-[4px] bg-primary text-[10px] text-primary-foreground">
              ✓
            </span>
            Keep going - open the next super admin
          </label>
          <span className="flex-1" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={isPending || wouldRemoveLastSuperAdmin}
            className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
          >
            {selectedTier === "super_admin"
              ? "Promote to Super Admin"
              : "Demote to Standard"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
