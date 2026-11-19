import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BidMatchActionsProps = {
  isMobile: boolean;
  canMatch: boolean;
  isSubmitting: boolean;
  saveError: string | null;
  onClose: () => void;
  onMatch: () => void;
};

export const BidMatchActions = ({
  isMobile,
  canMatch,
  isSubmitting,
  saveError,
  onClose,
  onMatch,
}: BidMatchActionsProps) => {
  return (
    <div className="border-t border-border bg-secondary/40">
      {saveError ? (
        <div className="border-b border-border bg-destructive/10 px-4 py-2 text-xs text-destructive">
          {saveError}
        </div>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3",
          isMobile ? "flex-col-reverse" : "justify-end",
        )}
      >
        <Button
          type="button"
          variant="outline"
          className={cn(isMobile && "w-full")}
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className={cn(isMobile && "w-full")}
          onClick={onMatch}
          disabled={!canMatch || isSubmitting}
        >
          {isSubmitting ? "Matching…" : "Match bid"}
        </Button>
      </div>
    </div>
  );
};
