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
import { usePriorityPickModal } from "./hook";
import { PriorityPickActions } from "./PriorityPickActions";
import { PriorityPickFields } from "./PriorityPickFields";

type PriorityPickModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

const PriorityPickModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: PriorityPickModalProps) => {
  const isMobile = useIsMobile();
  const modal = usePriorityPickModal({
    isOpen,
    onClose,
    scenarioId,
    transactionNo,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) modal.handleClose();
  };

  const fields = (
    <PriorityPickFields
      form={modal.form}
      isMobile={isMobile}
      clubOptions={modal.clubOptions}
      pickTypeOptions={modal.pickTypeOptions}
      alignedPickOptions={modal.alignedPickOptions}
      clubsLoading={modal.clubsLoading}
      pickTypesLoading={modal.pickTypesLoading}
      picksLoading={modal.picksLoading}
      showAlignedFields={modal.showAlignedFields}
      showOverallPick={modal.showOverallPick}
      referenceError={modal.referenceError}
      status={modal.status}
      team={modal.team}
      draftYear={modal.draftYear}
    />
  );

  const actions = (
    <PriorityPickActions
      handleClose={modal.handleClose}
      canAdd={modal.canAdd}
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
          <SheetTitle className="sr-only">Add priority pick</SheetTitle>
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
                    Add priority pick
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
          Give a club an extra pick and preview the change in draft points.
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
                  Add priority pick
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

export default PriorityPickModal;
