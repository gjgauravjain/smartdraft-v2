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
import { usePassPickModal } from "./hook";
import { PassPickActions } from "./PassPickActions";
import { PassPickFields } from "./PassPickFields";

type PassPickModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PassPickModal = ({ isOpen, onClose }: PassPickModalProps) => {
  const isMobile = useIsMobile();
  const {
    form,
    pickId,
    pickOptions,
    picksLoading,
    selectedPassPick,
    impactData,
    impactLoading,
    impactError,
    canPass,
    isSubmitting,
    handleClose,
    handleSubmit,
    selectedProject,
  } = usePassPickModal({ onClose });

  const readyToShowPreview = Boolean(pickId && selectedPassPick);

  const onOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const title = "Pass Picks";
  const description = `Pass one or all remaining picks for a club in ${selectedProject?.projectName ?? "this project"}.`;

  const fields = (
    <PassPickFields
      form={form}
      picksLoading={picksLoading}
      pickOptions={pickOptions}
      selectedPassPick={selectedPassPick}
      impactData={impactData}
      impactLoading={impactLoading}
      impactError={impactError?.message ?? null}
      readyToShowPreview={readyToShowPreview}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[92dvh] flex-col gap-0 border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>

          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                    Transaction · Pass Picks
                  </div>
                  <h2 className="text-[17px] font-bold text-foreground">
                    {title}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {description}
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

              <div className="flex-1 overflow-y-auto px-4 py-4">{fields}</div>

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
                  disabled={!canPass}
                  isLoading={isSubmitting}
                  className="h-12 flex-[2] rounded-[9px] text-[15px] font-bold"
                >
                  Pass picks
                </Button>
              </div>
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
        className="w-[520px] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[rgba(0,0,0,0.5)_0px_24px_70px_-10px] dark:border-border [&>button]:hidden"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-start gap-3 border-b border-border px-[22px] pb-4 pt-5">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                  Transaction · Pass Picks
                </div>
                <DialogTitle className="text-[17px] font-bold text-foreground">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1 max-w-[420px] text-xs leading-[1.45] text-muted-foreground">
                  {description}
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

            <div className="px-[22px] py-5">{fields}</div>

            <PassPickActions
              handleClose={handleClose}
              canPass={canPass}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PassPickModal;
