import { DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export const BidMatchHeader = ({
  eyebrow,
  title,
  onClose,
  desktop,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
  desktop?: boolean;
}) => {
  const heading = desktop ? (
    <DialogTitle className="mt-0.5 text-[15px] font-bold text-foreground">
      {title}
    </DialogTitle>
  ) : (
    <h2 className="mt-0.5 text-[15px] font-bold text-foreground">{title}</h2>
  );

  return (
    <div
      className={
        desktop
          ? "flex shrink-0 items-center gap-3 border-b border-border px-5 pb-3 pt-4"
          : "flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5"
      }
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
          {eyebrow}
        </div>
        {heading}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
