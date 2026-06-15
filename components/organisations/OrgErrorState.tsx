import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../ui/button";

type OrgErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

export const OrgErrorState = ({
  message = "Something went wrong while loading organisations.",
  onRetry,
}: OrgErrorStateProps) => (
  <div className="flex items-center justify-center flex-1 w-full">
    <div className="text-center max-w-95">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto mb-4.5">
        <AlertCircleIcon size={16} />
      </div>

      <p className="text-[18px] font-bold text-foreground">Failed to load</p>

      <p className="text-[13.5px] text-muted-foreground mt-1.75 leading-relaxed">
        {message}
      </p>

      <div className="mt-4.5 flex justify-center">
        <Button onClick={onRetry} variant="outline">
          <RefreshCwIcon size={16} />
          Try again
        </Button>
      </div>
    </div>
  </div>
);
