import { Button } from "@/components/ui/button";

export const ManualPickEditActions = ({
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
        className="h-10 rounded-[9px] border-border bg-card px-4 text-[13.5px] font-semibold text-[rgb(76,85,99)] dark:text-[rgb(169,180,194)]"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!canSave}
        isLoading={isSubmitting}
        className="h-10 rounded-[9px] px-[18px] text-[13.5px] font-bold shadow-[rgba(0,0,0,0.18)_0px_1px_2px]"
      >
        Save
      </Button>
    </div>
  );
};
