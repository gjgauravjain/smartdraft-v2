"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertTriangle, X } from "lucide-react";
import { ListSpotsGrid } from "@/components/transactions/list-spots/ListSpotsGrid";
import { useEnterDraftModeModal } from "./hook";
import { EnterDraftModeActions } from "./EnterDraftModeActions";
import { getDescription, TITLE, WARNING_COPY } from "./util";

type EnterDraftModeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EnterDraftModeModal = ({ isOpen, onClose }: EnterDraftModeModalProps) => {
  const isMobile = useIsMobile();
  const {
    grid,
    teamsById,
    spotsLoading,
    isSubmitting,
    canSubmit,
    handleClose,
    handleSubmit,
    handleSpotChange,
    selectedProject,
  } = useEnterDraftModeModal({ isOpen, onClose });

  const onOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const warning = (
    <Alert className="border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-xs leading-relaxed text-destructive">
        {WARNING_COPY}
      </AlertDescription>
    </Alert>
  );

  const content = (
    <div className="space-y-4">
      {warning}
      <ListSpotsGrid
        grid={grid}
        teamsById={teamsById}
        isLoading={spotsLoading}
        onChange={handleSpotChange}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[92dvh] flex-col gap-0 border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">{TITLE}</SheetTitle>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                  Transaction · Enter Draft Mode
                </div>
                <h2 className="text-[17px] font-bold text-foreground">
                  {TITLE}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {getDescription(
                    selectedProject?.projectName ?? "this project",
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">{content}</div>

            <div className="flex shrink-0 gap-2.5 border-t border-border bg-card px-4 pb-[26px] pt-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleClose}
                className="h-12 flex-1 rounded-[9px] border-border bg-card text-[15px] font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit}
                isLoading={isSubmitting}
                className="h-12 flex-[2] rounded-[9px] text-[15px] font-bold"
              >
                Enter Draft Mode
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
        className="w-[680px] h-[90vh] overflow-y-auto max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[rgba(0,0,0,0.5)_0px_24px_70px_-10px] dark:border-border [&>button]:hidden"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
          className="flex flex-col"
        >
          <div className="flex items-start gap-3 border-b border-border px-[22px] pb-4 pt-5">
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                Transaction · Enter Draft Mode
              </div>
              <DialogTitle className="text-[17px] font-bold text-foreground">
                {TITLE}
              </DialogTitle>
              <DialogDescription className="mt-1 max-w-[560px] text-xs leading-[1.45] text-muted-foreground">
                {getDescription(selectedProject?.projectName ?? "this project")}
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm text-muted-foreground transition-colors hover:bg-secondary"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="px-[22px] py-5">{content}</div>

          <EnterDraftModeActions
            handleClose={handleClose}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnterDraftModeModal;
