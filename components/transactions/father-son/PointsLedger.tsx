"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "./util";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { useIsMobile } from "@/hooks/use-mobile";
import { OutcomeLine } from "./OutcomeLine";

export const PointsLedger = ({
  impact,
  clubName,
}: {
  impact: FatherSonBidImpactResponse;
  clubName: string;
}) => {
  const isMobile = useIsMobile();

  if (impact.displayState === "match_next" && impact.pointsRequired === 0) {
    const matchNextPick = impact.overallImpactVisual?.find((v) =>
      /matched\s*with\s*next\s*pick/i.test(v.summary),
    );
    const firstValue =
      matchNextPick?.firstValue ?? impact.overallImpactDict[0]?.overallPick;

    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-4",
          isMobile && "rounded-[11px] p-3.75",
        )}
      >
        <div className="text-[10.5px] font-extrabold uppercase tracking-wide text-text4 mb-3">
          Paying for the bid
        </div>
        <div className="text-[13px] text-muted-foreground">
          Matched with your next pick (Pick {firstValue})
        </div>
        <OutcomeLine impact={impact} clubName={clubName} />
      </div>
    );
  }

  const pickRows =
    impact.overallImpactVisual?.filter(
      (v) =>
        v.summary !== "Points Deficit" &&
        (v.summary?.includes("Pick Lost") ||
          v.summary?.includes("Pick Shuffled Backwards")),
    ) ?? [];

  let owed = impact.pointsRequired;
  const tableRows = pickRows.map((visual) => {
    const pickValue = Number(visual.firstValueTooltip) || 0;

    owed -= pickValue;

    const isLost = visual.summary?.includes("Pick Lost");
    const isShuffled = visual.summary?.includes("Pick Shuffled Backwards");

    return {
      pick: `Pick ${visual.firstValue}`,
      statusTag: isLost
        ? "pick lost"
        : isShuffled
          ? `slides to ${visual.secondValue}`
          : "",
      pickValue: `-${visual.firstValueTooltip}`,
      stillToPay: owed < 0 ? 0 : owed,
      isLost,
      isShuffled,
    };
  });

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        isMobile && "rounded-[11px]",
      )}
    >
      <div className={cn("px-4 py-3", isMobile && "px-[15px] py-[11px]")}>
        <div className="text-[10.5px] font-extrabold uppercase tracking-wide text-text4 mb-2">
          Paying for the bid
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[9.5px] font-extrabold uppercase tracking-[0.5px] text-text4 pb-1.5"></th>
              <th className="text-left text-[9.5px] font-extrabold uppercase tracking-[0.5px] text-text4 pb-1.5"></th>
              <th className="text-right text-[9.5px] font-extrabold uppercase tracking-[0.5px] text-text4 pb-1.5">
                Pick value
              </th>
              <th className="text-right text-[9.5px] font-extrabold uppercase tracking-[0.5px] text-text4 pb-1.5 pl-4">
                Still to pay
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td
                colSpan={3}
                className="py-1.5 text-[13px] text-muted-foreground"
              >
                Points needed to match
              </td>
              <td className="py-1.5 text-right text-[13px] font-extrabold tabular-nums text-foreground pl-4">
                {formatNumber(impact.pointsRequired)}
              </td>
            </tr>

            {tableRows.map((row, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="py-1.5 text-[13px] font-bold text-foreground">
                  {row.pick}
                </td>
                <td className="py-1.5">
                  <span
                    className={cn(
                      "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                      row.isLost &&
                        "bg-destructive/10 text-destructive border border-destructive/30",
                      row.isShuffled &&
                        "bg-secondary text-muted-foreground border border-border",
                    )}
                  >
                    {row.statusTag}
                  </span>
                </td>
                <td className="py-1.5 text-right text-[13px] font-semibold text-destructive tabular-nums">
                  {row.pickValue}
                </td>
                <td className="py-1.5 text-right text-[13px] font-extrabold tabular-nums text-foreground pl-4">
                  {formatNumber(row.stillToPay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <OutcomeLine impact={impact} clubName={clubName} />
      </div>
    </div>
  );
};
