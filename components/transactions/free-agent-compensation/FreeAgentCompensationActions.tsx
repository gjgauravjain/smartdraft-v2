"use client";

import { Button } from "@/components/ui/button";
import { actionBarClass, actionButtonClass } from "./util";

type FreeAgentCompensationActionsProps = {
  isMobile: boolean;
  canAdd: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
};

export const FreeAgentCompensationActions = ({
  isMobile,
  canAdd,
  isSubmitting,
  onCancel,
}: FreeAgentCompensationActionsProps) => {
  return (
    <div className={actionBarClass(isMobile)}>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={onCancel}
        className={actionButtonClass(isMobile)}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!canAdd}
        isLoading={isSubmitting}
        className={actionButtonClass(isMobile)}
      >
        Add compensation pick
      </Button>
    </div>
  );
};
