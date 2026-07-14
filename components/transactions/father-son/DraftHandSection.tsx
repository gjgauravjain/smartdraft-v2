import { OverallImpactItem } from "@/app/api/type/transaction";
import { cn } from "@/lib/utils";

export function DraftHandSection({
  title,
  chips,
  variant,
}: {
  title: string;
  chips: Array<{
    pick: string | number;
    impact?: OverallImpactItem;
    used?: boolean;
  }>;
  variant: "before" | "after";
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="whitespace-nowrap text-[10.5px] font-extrabold uppercase tracking-wide text-text4">
          {title}
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c, idx) => {
          const isLost =
            variant === "before" && /lost/i.test(c.impact?.action ?? "");
          const isShuffled =
            variant === "before" && /shuffle/i.test(c.impact?.action ?? "");
          const isHighlighted = variant === "after" && c.used;

          return (
            <div
              key={`${c.pick}-${idx}`}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[12.5px] font-bold tabular-nums",
                isLost &&
                  "border-destructive/30 bg-destructive/10 text-destructive",
                isShuffled &&
                  "border-border bg-secondary/60 text-muted-foreground",
                isHighlighted &&
                  "border-primary bg-primary text-primary-foreground",
                !isLost &&
                  !isShuffled &&
                  !isHighlighted &&
                  "border-border bg-card text-foreground",
              )}
            >
              <span className={isLost ? "line-through" : undefined}>
                {c.pick}
              </span>
              {isShuffled && (
                <span className="text-[10.5px] font-semibold opacity-80">
                  → {c.impact?.newPickNo}
                </span>
              )}
              {isHighlighted && (
                <span className="text-[10.5px] font-semibold opacity-80">
                  father-son
                </span>
              )}
            </div>
          );
        })}
        {chips.length === 0 && (
          <span className="text-xs text-muted-foreground">No picks</span>
        )}
      </div>
    </div>
  );
}
