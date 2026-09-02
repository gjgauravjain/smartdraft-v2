"use client";

import { TransactionMenuValue } from "./type";
import FatherSonBidMatchModal from "@/components/transactions/father-son/FatherSonBidMatchModal";
import ManualPickEditModal from "@/components/transactions/manual-pick-edit/ManualPickEditModal";
import MovePickModal from "@/components/transactions/move-pick-edit/MovePickModal";
import EnterDraftModeModal from "@/components/transactions/draft-mode/EnterDraftModeModal";
import PassPickModal from "@/components/transactions/pass-pick/PassPickModal";
import { hasRebuildDraftEditCapability } from "@/lib/capabilities";
import { useAuth } from "@/store/useStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { TRANSACTION_MENU_OPTIONS_VALUE } from "./util";

type TransactionModalSwitchProps = {
  type: TransactionMenuValue;
  onClose: () => void;
};

const TransactionModalSwitch = ({
  type,
  onClose,
}: TransactionModalSwitchProps) => {
  const { user } = useAuth();

  useEffect(() => {
    const requiresDraftEdit =
      type === TRANSACTION_MENU_OPTIONS_VALUE.MANUAL_PICK_EDIT ||
      type === TRANSACTION_MENU_OPTIONS_VALUE.MOVE_PICK;

    if (requiresDraftEdit && !hasRebuildDraftEditCapability(user)) {
      toast.error("You do not have permission to edit draft picks.");
      onClose();
    }
  }, [type, user, onClose]);

  if (!type) return null;
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.COMPLETED_TRADE) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.MULTI_COMPLETED_TRADE) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.PRIORITY_PICK) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.FREE_AGENT_COMPENSATION) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.APPLY_COMPENSATION) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.ACADEMY_BID_MATCH) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.FATHER_SON_BID_MATCH) {
    return <FatherSonBidMatchModal isOpen={true} onClose={onClose} />;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.NGA_BID_MATCH) {
    return <></>;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.DRAFT_NIGHT_SELECTION) {
    return <></>;
  }

  if (type === TRANSACTION_MENU_OPTIONS_VALUE.MANUAL_PICK_EDIT) {
    if (!hasRebuildDraftEditCapability(user)) return null;

    return <ManualPickEditModal isOpen={true} onClose={onClose} />;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.MOVE_PICK) {
    if (!hasRebuildDraftEditCapability(user)) return null;

    return <MovePickModal isOpen={true} onClose={onClose} />;
  }
  if (type === TRANSACTION_MENU_OPTIONS_VALUE.PASS_PICKS) {
    return <PassPickModal isOpen={true} onClose={onClose} />;
  }
  if (type === "delete_unusable_picks") {
    return <EnterDraftModeModal isOpen={true} onClose={onClose} />;
  }

  return null;
};
export default TransactionModalSwitch;
