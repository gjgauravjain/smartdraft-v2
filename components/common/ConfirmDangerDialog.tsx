import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ConfirmDangerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  subtitle?: string;
  description: string;

  confirmText?: string;

  actionLabel?: string;
  cancelLabel?: string;

  onConfirm: () => void;
  isLoading?: boolean;
};

export function ConfirmDangerDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  description,
  confirmText,
  actionLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading,
}: ConfirmDangerDialogProps) {
  const [value, setValue] = useState("");

  const canSubmit = confirmText ? value.trim() === confirmText : true;

  const handleClose = () => {
    setValue("");
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] p-0 overflow-hidden">
        <DialogTitle />
        <div className="p-[22px]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-foreground">{title}</h2>

              {subtitle && (
                <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          {confirmText && (
            <div className="mt-4">
              <label className="mb-2 block text-xs text-muted-foreground">
                Type{" "}
                <strong className="font-mono text-foreground">
                  {confirmText}
                </strong>{" "}
                to confirm
              </label>

              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={confirmText}
                className="font-mono tracking-[0.5px]"
              />
            </div>
          )}

          <div className="mt-5 flex justify-end gap-2.5">
            <Button variant="outline" onClick={handleClose}>
              {cancelLabel}
            </Button>

            <Button
              variant="destructive"
              disabled={!canSubmit || isLoading}
              onClick={handleConfirm}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              {actionLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
