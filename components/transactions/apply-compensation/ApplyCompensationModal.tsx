"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { ApplyCompensationActions } from "./ApplyCompensationActions";
import { ApplyCompensationBody } from "./ApplyCompensationBody";
import { useApplyCompensationModal } from "./hook";

type ApplyCompensationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

const ApplyCompensationModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: ApplyCompensationModalProps) => {
  const isMobile = useIsMobile();
  const modal = useApplyCompensationModal({
    isOpen,
    onClose,
    scenarioId,
    transactionNo,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) modal.handleClose();
  };

  const body = (
    <ApplyCompensationBody view={modal.view} teams={modal.teams} />
  );
  const actions = (
    <ApplyCompensationActions
      view={modal.view}
      isSubmitting={modal.isSubmitting}
      isMobile={isMobile}
      onClose={modal.handleClose}
      onApply={modal.handleApply}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[85dvh] max-h-[85dvh] flex-col gap-0 overflow-hidden rounded-t-2xl border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Apply compensation picks</SheetTitle>
          <div className="flex min-h-0 flex-1 flex-col">
            <Header onClose={modal.handleClose} />
            <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-3">
              {body}
            </div>
            {actions}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
        className="flex max-h-[85dvh] w-160 max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_16px_48px_rgba(0,0,0,0.16)] [&>button]:hidden"
      >
        <DialogDescription className="sr-only">
          Preview the compensation picks that are due, then add them to the
          draft.
        </DialogDescription>
        <div className="flex min-h-0 flex-1 flex-col">
          <Header onClose={modal.handleClose} desktop />
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-3.5">
            {body}
          </div>
          {actions}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Header = ({
  onClose,
  desktop = false,
}: {
  onClose: () => void;
  desktop?: boolean;
}) => {
  const title = desktop ? (
    <DialogTitle className="mt-0.5 text-[15px] font-bold text-foreground">
      Apply compensation picks
    </DialogTitle>
  ) : (
    <h2 className="mt-0.5 text-[15px] font-bold text-foreground">
      Apply compensation picks
    </h2>
  );

  return (
    <div
      className={
        desktop
          ? "flex shrink-0 items-center gap-3 border-b border-border px-5 pb-3 pt-4"
          : "flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5"
      }
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
          Transaction
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

export default ApplyCompensationModal;
