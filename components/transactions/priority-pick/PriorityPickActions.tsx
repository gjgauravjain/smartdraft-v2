"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { actionClass } from "./util";

type PriorityPickActionsProps = {
  handleClose: () => void;
  canAdd: boolean;
  isSubmitting: boolean;
  isMobile: boolean;
};

export const PriorityPickActions = ({
  handleClose,
  canAdd,
  isSubmitting,
  isMobile,
}: PriorityPickActionsProps) => {
  return (
    <div
      className={cn(
        "flex shrink-0 gap-2 border-t border-border bg-card px-5 py-3",
        isMobile ? "px-4 pb-6.5" : "justify-end",
      )}
    >
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={handleClose}
        className={actionClass(isMobile)}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!canAdd}
        isLoading={isSubmitting}
        className={actionClass(isMobile)}
      >
        Add priority pick
      </Button>
    </div>
  );
};
