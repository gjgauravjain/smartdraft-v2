import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSubmitFatherSonBid } from "@/app/api/react-query/transactions";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { getErrorMessage } from "@/lib/api-client";

type ActionButtonProps = {
  handleClose: () => void;
  displayedImpact: FatherSonBidImpactResponse | null;
  projectId: number;
  fsTeamId: string;
  playerId: string;
  pickId: string;
  onSuccess?: () => void;
};

const ActionButton = ({
  handleClose,
  displayedImpact,
  projectId,
  fsTeamId,
  playerId,
  pickId,
  onSuccess,
}: ActionButtonProps) => {
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(null);
  const submitMutation = useSubmitFatherSonBid();

  const handleMatchBid = async () => {
    if (!displayedImpact || !displayedImpact.canProceed) return;

    setError(null);
    try {
      await submitMutation.mutateAsync({
        projectId,
        fsTeamId,
        playerId,
        pickId,
      });
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to match bid"));
    }
  };

  return (
    <div className="border-t border-border bg-secondary/40">
      {error && (
        <div className="border-b border-border bg-destructive/10 px-6 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3 px-6 py-3.5">
        {!isMobile && <div className="flex-1" />}

        <Button
          className={cn(isMobile && "flex-1")}
          variant="outline"
          onClick={handleClose}
          disabled={submitMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          disabled={
            !displayedImpact ||
            !displayedImpact.canProceed ||
            submitMutation.isPending
          }
          className={cn(
            isMobile && "flex-1",
            "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          onClick={handleMatchBid}
        >
          {submitMutation.isPending ? "Matching..." : "Match bid"}
        </Button>
      </div>
    </div>
  );
};

export default ActionButton;
