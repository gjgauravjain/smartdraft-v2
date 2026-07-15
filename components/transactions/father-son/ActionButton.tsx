import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  handleClose: () => void;
  displayedImpact: any;
};
const ActionButton = ({ handleClose, displayedImpact }: ActionButtonProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-3 border-t border-border bg-secondary/40 px-6 py-3.5">
      {!isMobile && <div className="flex-1" />}

      <Button
        className={cn(isMobile && "flex-1")}
        variant="outline"
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button
        disabled={!displayedImpact || !displayedImpact.canProceed}
        className={cn(
          isMobile && "flex-1",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
        onClick={() => {
          handleClose();
        }}
      >
        Match bid
      </Button>
    </div>
  );
};

export default ActionButton;
