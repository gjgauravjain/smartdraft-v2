"use client";

import { DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

type TradeTeamModalHeaderProps = {
  onClose: () => void;
  desktop?: boolean;
};

export const TradeTeamModalHeader = ({
  onClose,
  desktop = false,
}: TradeTeamModalHeaderProps) => {
  const title = desktop ? (
    <DialogTitle className="mt-0.5 text-[15px] font-bold text-foreground">
      New trade
    </DialogTitle>
  ) : (
    <h2 className="mt-0.5 text-[15px] font-bold text-foreground">New trade</h2>
  );

  return (
    <div
      className={
        desktop
          ? "flex shrink-0 items-center gap-3 border-b border-border bg-card px-5 pt-4 pb-3"
          : "flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3.5"
      }
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold tracking-wider text-highlight-text uppercase">
          Trade
        </div>
        {title}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};