"use client";

import { Button } from "@/components/ui/button";
import { ApplyCompensationView } from "./type";
import { actionButtonClass, actionRowClass, applyButtonLabel } from "./util";

type ApplyCompensationActionsProps = {
  view: ApplyCompensationView;
  isSubmitting: boolean;
  isMobile: boolean;
  onClose: () => void;
  onApply: () => void;
};

export const ApplyCompensationActions = ({
  view,
  isSubmitting,
  isMobile,
  onClose,
  onApply,
}: ApplyCompensationActionsProps) => {
  const closeOnly = view.kind === "empty" || view.kind === "error";
  const label =
    view.kind === "ready"
      ? applyButtonLabel(view.picks.length)
      : applyButtonLabel(null);

  return (
    <div className={actionRowClass(isMobile)}>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={onClose}
        className={actionButtonClass(isMobile)}
      >
        {closeOnly ? "Close" : "Cancel"}
      </Button>
      {closeOnly ? null : (
        <Button
          type="button"
          disabled={view.kind !== "ready" || isSubmitting}
          isLoading={isSubmitting}
          onClick={onApply}
          className={actionButtonClass(isMobile)}
        >
          {label}
        </Button>
      )}
    </div>
  );
};
