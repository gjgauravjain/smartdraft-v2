import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TradeFooter = ({
  isMobile,
  note,
  noteTone,
  canConfirm,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  isMobile: boolean;
  note: string;
  noteTone: "default" | "danger";
  canConfirm: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const noteClass = cn(
    noteTone === "danger" ? "text-destructive" : "text-muted-foreground",
  );

  if (isMobile) {
    return (
      <div className="shrink-0 border-t border-border bg-card">
        {note ? (
          <div className={cn("w-full px-4 pt-2 text-[10.5px]", noteClass)}>
            {note}
          </div>
        ) : null}
        <div className="flex gap-[9px] px-4 pb-[22px] pt-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-auto flex-1 rounded-[9px] py-[13px] text-[13.5px] font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canConfirm}
            isLoading={isSubmitting}
            onClick={onConfirm}
            className="h-auto flex-[2] rounded-[9px] py-[13px] text-[13.5px] font-extrabold"
          >
            Confirm trade
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-border bg-muted/50 px-6 py-3.5">
      <div className={cn("min-w-0 flex-1 text-[11.5px]", noteClass)}>
        {note}
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={!canConfirm}
        isLoading={isSubmitting}
        onClick={onConfirm}
      >
        Confirm trade
      </Button>
    </div>
  );
};
