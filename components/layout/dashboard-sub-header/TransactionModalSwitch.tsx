import { TransactionMenuValue } from "./type";
import FatherSonBidMatchModal from "@/components/transactions/father-son/FatherSonBidMatchModal";
import ManualPickEditModal from "@/components/transactions/manual-pick-edit/ManualPickEditModal";
import PassPickModal from "@/components/transactions/pass-pick/PassPickModal";
import { hasRebuildDraftEditCapability } from "@/lib/capabilities";
import { useAuth } from "@/store/useStore";
import { useEffect } from "react";
import { toast } from "sonner";

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
    if (type === "manual_pick_edit" && !hasRebuildDraftEditCapability(user)) {
      toast.error("You do not have permission to edit draft picks.");
      onClose();
    }
  }, [type, user, onClose]);

  if (!type) return null;
  if (type === "completed_trade") {
    return <></>;
  }
  if (type === "multi_completed_trade") {
    return <></>;
  }
  if (type === "priority_pick") {
    return <></>;
  }
  if (type === "free_agent_compensation") {
    return <></>;
  }
  if (type === "apply_compensation") {
    return <></>;
  }
  if (type === "academy_bid_match") {
    return <></>;
  }
  if (type === "father_son_bid_match") {
    return <FatherSonBidMatchModal isOpen={true} onClose={onClose} />;
  }
  if (type === "nga_bid_match") {
    return <></>;
  }
  if (type === "draft_night_selection") {
    return <></>;
  }
  if (type === "manual_pick_edit") {
    if (!hasRebuildDraftEditCapability(user)) return null;

    return <ManualPickEditModal isOpen={true} onClose={onClose} />;
  }
  if (type === "pass_picks") {
    return <PassPickModal isOpen={true} onClose={onClose} />;
  }
  if (type === "delete_unusable_picks") {
    return <></>;
  }

  return null;
};
export default TransactionModalSwitch;
