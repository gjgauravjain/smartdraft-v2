import { TradeValidityCheck } from "@/app/api/type/trade";
import { checkPickLabel } from "./util";
import { cn } from "@/lib/utils";

export const RuleCheckRow = ({
  label,
  check,
}: {
  label: string;
  check: TradeValidityCheck;
}) => {
  const failed = check.status === "Fail";
  const warning = check.status === "Warning";
  const pickLabels = check.picks
    .map(checkPickLabel)
    .filter((name): name is string => Boolean(name));

  return (
    <div className="flex items-start gap-[9px] border-t border-border px-[13px] py-2.5 first:border-t-0">
      <span
        className={cn(
          "mt-1 h-2 w-2 shrink-0 rounded-full",
          failed && "bg-destructive",
          warning && "bg-amber-500",
          !failed && !warning && "bg-success",
        )}
      />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-xs font-bold",
            failed ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
          <span
            className={cn(
              "ml-1 text-[10.5px] font-semibold",
              failed
                ? "text-destructive"
                : warning
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-muted-foreground",
            )}
          >
            {check.status}
          </span>
        </div>
        {check.description ? (
          <div
            className={cn(
              "mt-0.5 text-[11.5px] leading-[1.45]",
              failed ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {check.description}
          </div>
        ) : null}
        {pickLabels.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {pickLabels.map((name) => (
              <span
                key={name}
                className={cn(
                  "inline-flex h-6 items-center whitespace-nowrap rounded-full border px-[9px] text-[11px] font-bold tabular-nums",
                  failed
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : warning
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "border-border bg-muted text-foreground/80",
                )}
              >
                {name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
