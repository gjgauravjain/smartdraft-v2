import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode } from "react";

export const TradeAssetChip = ({
  label,
  meta,
  icon,
  onRemove,
  compact = false,
}: {
  label: string;
  meta?: string;
  icon?: ReactNode;
  onRemove?: () => void;
  compact?: boolean;
}) => {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card font-bold tabular-nums text-foreground",
        compact
          ? "h-6 px-2.5 text-[11px]"
          : "h-[30px] py-0 pl-[11px] pr-1.5 text-[12.5px]",
      )}
    >
      {icon}
      <span className="min-w-0 truncate">{label}</span>
      {meta ? (
        <span className="shrink-0 text-[10.5px] font-semibold text-muted-foreground">
          {meta}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          title="Remove"
          onClick={onRemove}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
            compact
              ? "h-[18px] w-[18px]"
              : "h-11 min-h-11 w-11 min-w-11 md:h-[18px] md:min-h-[18px] md:w-[18px] md:min-w-[18px]",
          )}
          aria-label={`Remove ${label}`}
        >
          <X className="h-2.5 w-2.5" />
        </button>
      ) : null}
    </div>
  );
};
