"use client";

import { Button } from "@/components/ui/button";
import { actionButtonClass, actionRowClass } from "./util";

type TradeTeamActionsProps = {
  canConfirm: boolean;
  isSubmitting: boolean;
  isMobile: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const TradeTeamActions = ({
  canConfirm,
  isSubmitting,
  isMobile,
  onClose,
  onConfirm,
}: TradeTeamActionsProps) => (
  <div className={actionRowClass(isMobile)}>
    <Button
      type="button"
      variant="outline"
      disabled={isSubmitting}
      onClick={onClose}
      className={actionButtonClass(isMobile)}
    >
      Cancel
    </Button>
    <Button
      type="button"
      disabled={!canConfirm || isSubmitting}
      isLoading={isSubmitting}
      onClick={onConfirm}
      className={actionButtonClass(isMobile)}
    >
      Confirm trade
    </Button>
  </div>
);
