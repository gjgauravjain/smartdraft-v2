"use client";

import { Button } from "@/components/ui/button";
import { actionButtonClass, actionRowClass } from "./util";

type DraftNightSelectionActionsProps = {
  handleClose: () => void;
  canDraft: boolean;
  isSubmitting: boolean;
  isMobile: boolean;
};

export const DraftNightSelectionActions = ({
  handleClose,
  canDraft,
  isSubmitting,
  isMobile,
}: DraftNightSelectionActionsProps) => {
  return (
    <div className={actionRowClass(isMobile)}>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={handleClose}
        className={actionButtonClass(isMobile)}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!canDraft}
        isLoading={isSubmitting}
        className={actionButtonClass(isMobile)}
      >
        Draft player
      </Button>
    </div>
  );
};
