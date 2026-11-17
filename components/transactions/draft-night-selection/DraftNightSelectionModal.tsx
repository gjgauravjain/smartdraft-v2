"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { DraftNightSelectionActions } from "./DraftNightSelectionActions";
import { DraftNightSelectionFields } from "./DraftNightSelectionFields";
import { useDraftNightSelectionModal } from "./hook";

type DraftNightSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DraftNightSelectionModal = ({
  isOpen,
  onClose,
}: DraftNightSelectionModalProps) => {
  const isMobile = useIsMobile();
  const modal = useDraftNightSelectionModal({ isOpen, onClose });

  const onOpenChange = (open: boolean) => {
    if (!open) modal.handleClose();
  };

  const fields = (
    <DraftNightSelectionFields
      isMobile={isMobile}
      teams={modal.teams}
      years={modal.years}
      yearFilter={modal.yearFilter}
      onYearChange={modal.setYearFilter}
      visiblePicks={modal.visiblePicks}
      players={modal.players}
      pickQuery={modal.pickQuery}
      onPickQueryChange={modal.setPickQuery}
      playerQuery={modal.playerQuery}
      onPlayerQueryChange={modal.setPlayerQuery}
      openPanel={modal.openPanel}
      onTogglePanel={modal.togglePanel}
      onDismiss={modal.closePanel}
      onSelectPick={modal.selectPick}
      onSelectPlayer={modal.selectPlayer}
      selectedPick={modal.selectedPick}
      selectedPlayer={modal.selectedPlayer}
      picksLoading={modal.picksLoading}
      picksError={modal.picksError}
      playersLoading={modal.playersLoading}
      playersError={modal.playersError}
      saveError={modal.saveError}
    />
  );

  const actions = (
    <DraftNightSelectionActions
      handleClose={modal.handleClose}
      canDraft={modal.canDraft}
      isSubmitting={modal.isSubmitting}
      isMobile={isMobile}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[85dvh] max-h-[85dvh] flex-col gap-0 overflow-hidden rounded-t-2xl border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Draft Night Selection</SheetTitle>
          <Form {...modal.form}>
            <form
              onSubmit={modal.handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                    Transaction
                  </div>
                  <h2 className="mt-0.5 text-[15px] font-bold text-foreground">
                    Draft Night Selection
                  </h2>
                </div>
                <CloseButton onClose={modal.handleClose} />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {fields}
              </div>
              {actions}
            </form>
          </Form>
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
          Record that a club used a pick on a player.
        </DialogDescription>
        <Form {...modal.form}>
          <form
            onSubmit={modal.handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 pb-3 pt-4">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                  Transaction
                </div>
                <DialogTitle className="mt-0.5 text-[15px] font-bold text-foreground">
                  Draft Night Selection
                </DialogTitle>
              </div>
              <CloseButton onClose={modal.handleClose} />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3.5">
              {fields}
            </div>
            {actions}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClose}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
      aria-label="Close"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
};

export default DraftNightSelectionModal;
