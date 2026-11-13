"use client";

import { Button } from "@/components/ui/button";
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
import { FreeAgentCompensationActions } from "./FreeAgentCompensationActions";
import { FreeAgentCompensationFields } from "./FreeAgentCompensationFields";
import { useFreeAgentCompensationModal } from "./hook";

type FreeAgentCompensationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

export const FreeAgentCompensationModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: FreeAgentCompensationModalProps) => {
  const isMobile = useIsMobile();
  const modal = useFreeAgentCompensationModal({
    isOpen,
    onClose,
    scenarioId,
    transactionNo,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) modal.handleClose();
  };

  const fields = (
    <FreeAgentCompensationFields
      form={modal.form}
      isMobile={isMobile}
      clubOptions={modal.clubOptions}
      pickTypeOptions={modal.pickTypeOptions}
      alignedPickOptions={modal.alignedPickOptions}
      players={modal.players}
      teams={modal.teams}
      clubsLoading={modal.clubsLoading}
      pickTypesLoading={modal.pickTypesLoading}
      picksLoading={modal.picksLoading}
      playersLoading={modal.playersLoading}
      showAlignedFields={modal.showAlignedFields}
      showOverallPick={modal.showOverallPick}
      referenceError={modal.referenceError}
      status={modal.status}
      team={modal.team}
      draftYear={modal.draftYear}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[85dvh] max-h-[85dvh] flex-col gap-0 overflow-hidden rounded-t-2xl border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">
            Add free agent compensation
          </SheetTitle>
          <Form {...modal.form}>
            <form
              onSubmit={modal.handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <ModalHeader onClose={modal.handleClose} />
              <div className="flex-1 overflow-y-auto px-4 py-4">{fields}</div>
              <FreeAgentCompensationActions
                isMobile
                canAdd={modal.canAdd}
                isSubmitting={modal.isSubmitting}
                onCancel={modal.handleClose}
              />
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
        className="flex max-h-[85dvh] w-160 max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[rgba(0,0,0,0.5)_0px_24px_70px_-10px] [&>button]:hidden"
      >
        <DialogDescription className="sr-only">
          Add a free agent compensation pick and preview the impact before
          saving.
        </DialogDescription>
        <Form {...modal.form}>
          <form
            onSubmit={modal.handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <ModalHeader onClose={modal.handleClose} desktop />
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {fields}
            </div>
            <FreeAgentCompensationActions
              isMobile={false}
              canAdd={modal.canAdd}
              isSubmitting={modal.isSubmitting}
              onCancel={modal.handleClose}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ModalHeader = ({
  onClose,
  desktop = false,
}: {
  onClose: () => void;
  desktop?: boolean;
}) => {
  return (
    <div
      className={
        desktop
          ? "flex shrink-0 items-start gap-3 border-b border-border px-5 pb-4 pt-5"
          : "flex shrink-0 items-start gap-3 border-b border-border px-4 py-4"
      }
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
          Transaction
        </div>
        <HeaderTitle desktop={desktop} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onClose}
        aria-label="Close"
        className="h-8 w-8 shrink-0 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const HeaderTitle = ({ desktop }: { desktop: boolean }) => {
  if (desktop) {
    return (
      <DialogTitle className="text-[17px] font-bold text-foreground">
        Add free agent compensation
      </DialogTitle>
    );
  }

  return (
    <h2 className="text-[17px] font-bold text-foreground">
      Add free agent compensation
    </h2>
  );
};

export default FreeAgentCompensationModal;
