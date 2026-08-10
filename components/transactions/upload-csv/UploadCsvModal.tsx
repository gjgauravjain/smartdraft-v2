"use client";

import { FormSelectField } from "@/components/common/fields/FormSelectField";
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
import { UploadCsvTransactionType } from "@/store/useStore";
import { X } from "lucide-react";
import { useWatch } from "react-hook-form";
import { UploadCsvActions } from "./UploadCsvActions";
import { useUploadCsvModal } from "./hook";
import { DESCRIPTION, TITLE } from "./util";

type UploadCsvModalProps = {
  uploadCsvTransactionType: UploadCsvTransactionType;
};

const UploadCsvModal = ({
  uploadCsvTransactionType,
}: UploadCsvModalProps) => {
  const isMobile = useIsMobile();
  const {
    form,
    fileOptions,
    filesLoading,
    isSubmitting,
    handleClose,
    handleSubmit,
  } = useUploadCsvModal(uploadCsvTransactionType);

  const selectedCsv = useWatch({ control: form.control, name: "csv" });
  const canSave = Boolean(selectedCsv) && !filesLoading;

  const onOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const fields = (
    <FormSelectField
      control={form.control}
      name="csv"
      label="CSV file"
      required
      options={fileOptions}
      isSearchable
      placeholder={filesLoading ? "Loading files…" : "Select a CSV file"}
      emptyMessage="No CSV files available."
      searchPlaceholder="Search files…"
      disabled={filesLoading || isSubmitting}
    />
  );

  if (isMobile) {
    return (
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-auto max-h-[92dvh] flex-col gap-0 border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">{TITLE}</SheetTitle>

          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                    Admin · Draft CSV
                  </div>
                  <h2 className="text-[17px] font-bold text-foreground">
                    {TITLE}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {DESCRIPTION}
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

              <div className="px-4 py-4">{fields}</div>

              <div className="flex shrink-0 gap-2.5 border-t border-border bg-card px-4 pb-[26px] pt-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={handleClose}
                  className="h-12 flex-1 rounded-[9px] border-border bg-card text-[15px] font-semibold"
                >
                  Skip
                </Button>
                <Button
                  type="submit"
                  disabled={!canSave}
                  isLoading={isSubmitting}
                  className="h-12 flex-[2] rounded-[9px] text-[15px] font-bold"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
        className="w-[480px] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[rgba(0,0,0,0.5)_0px_24px_70px_-10px] dark:border-border [&>button]:hidden"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-start gap-3 border-b border-border px-[22px] pb-4 pt-5">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                  Admin · Draft CSV
                </div>
                <DialogTitle className="text-[17px] font-bold text-foreground">
                  {TITLE}
                </DialogTitle>
                <DialogDescription className="mt-1 max-w-[380px] text-xs leading-[1.45] text-muted-foreground">
                  {DESCRIPTION}
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

            <UploadCsvActions
              handleClose={handleClose}
              canSave={canSave}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCsvModal;
