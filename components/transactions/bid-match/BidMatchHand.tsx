import { cn } from "@/lib/utils";
import { BidMatchResult } from "./type";
import { chipClass } from "./util";

type BidMatchHandProps = {
  result: BidMatchResult;
  isMobile: boolean;
};

export const BidMatchHand = ({ result, isMobile }: BidMatchHandProps) => {
  if (!result.hand.length) return null;

  return (
    <div className="grid gap-3">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        Picks after match
      </div>
      {result.hand.map((year) => (
        <div key={year.year} className="grid gap-1.5">
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="font-semibold text-foreground">{year.year}</span>
            {year.points ? (
              <span className="text-muted-foreground tabular-nums">
                {year.points}
              </span>
            ) : null}
          </div>
          <div
            className={cn(
              "grid gap-1.5",
              isMobile ? "grid-cols-3" : "grid-cols-4",
            )}
          >
            {year.chips.map((chip) => (
              <span
                key={chip.key}
                className={cn(
                  "rounded-md px-1.5 py-1 text-center text-[11px] font-semibold leading-tight",
                  chipClass(chip.tone),
                )}
              >
                <span className="block">{chip.label}</span>
                {chip.name ? (
                  <span className="mt-0.5 block text-[10px] font-medium">
                    {chip.name}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      ))}
      {result.legend.length ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {result.legend.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
