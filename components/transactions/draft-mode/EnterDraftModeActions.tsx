import { Button } from "@/components/ui/button";

export const EnterDraftModeActions = ({
  handleClose,
  canSubmit,
  isSubmitting,
}: {
  handleClose: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
}) => {
  return (
    <div className="flex justify-end gap-2.5 border-t border-border bg-secondary px-[22px] py-3.5 dark:bg-muted">
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting}>
        Enter Draft Mode
      </Button>
    </div>
  );
};
