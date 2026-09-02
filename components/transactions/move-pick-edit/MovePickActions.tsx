import { Button } from "@/components/ui/button";

export const MovePickActions = ({
  handleClose,
  canSave,
  isSubmitting,
}: {
  handleClose: () => void;
  canSave: boolean;
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
      <Button type="submit" disabled={!canSave} isLoading={isSubmitting}>
        Move pick
      </Button>
    </div>
  );
};
