import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImpactVisualType } from "@/app/api/type/transaction";
import { formatNumber } from "./util";

export function PointsLedgerDeficit({
  deficitVisual,
  appliedTotal,
  pointsRequired,
  isMobile,
}: {
  deficitVisual: ImpactVisualType;
  appliedTotal: number;
  pointsRequired: number;
  isMobile: boolean;
}) {
  const [deficitDetailOpen, setDeficitDetailOpen] = useState(false);

  return (
    <div
      className={cn(
        "points-ledger-deficit-card mx-4 mb-4 overflow-hidden rounded-lg border",
        isMobile && "mx-[15px] mb-[15px]",
      )}
    >
      <div className="flex items-center gap-2.5 px-3.25 py-2.75">
        <div className="min-w-0 flex-1">
          <div className="points-ledger-deficit-text text-[11.5px] tabular-nums">
            <strong>{formatNumber(appliedTotal)}</strong> applied{" "}
            <span className="opacity-70">-</span>{" "}
            <strong>{formatNumber(pointsRequired)}</strong> required
          </div>
          {deficitVisual.deficitSummary && (
            <div className="points-ledger-deficit-text mt-0.5 text-[10.5px] opacity-92">
              {deficitVisual.deficitSummary}
            </div>
          )}
        </div>
        <div className="points-ledger-deficit-text whitespace-nowrap text-right text-[13.5px] font-extrabold tabular-nums">
          Deficit -{formatNumber(deficitVisual.pointsDeficit ?? 0)}
          {deficitVisual.deficitYear && (
            <div className="text-[9.5px] font-bold tracking-[0.3px]">
              carried &rarr; {deficitVisual.deficitYear}
            </div>
          )}
        </div>
      </div>

      {deficitVisual.deficitExceedsCap && (
        <div className="points-ledger-deficit-alert mx-3.25 mb-2.75 flex items-start gap-1.75 rounded-md border px-2.5 py-2">
          <AlertTriangle className="points-ledger-deficit-text mt-0.5 h-3 w-3 shrink-0" />
          <div className="points-ledger-deficit-text text-[10.5px] leading-snug">
            {deficitVisual.deficitWarning ??
              `This deficit exceeds the allowable cap of ${formatNumber(
                deficitVisual.allowableDeficitPoints ?? 0,
              )} pts.`}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setDeficitDetailOpen((v) => !v)}
        className="points-ledger-deficit-text points-ledger-deficit-divider flex w-full items-center gap-1.25 border-t px-3.25 py-1.75 text-left text-[11px] font-bold"
      >
        {deficitDetailOpen ? (
          <ChevronDown className="h-2.5 w-2.5 shrink-0" />
        ) : (
          <ChevronRight className="h-2.5 w-2.5 shrink-0" />
        )}
        Deficit detail -{" "}
        {deficitDetailOpen ? "hide" : "how the points were subtracted"}
      </button>

      {deficitDetailOpen && deficitVisual.deficitImpact && (
        <div className="overflow-x-auto px-2.5 pb-2.5 pt-1">
          <table className="w-full border-collapse tabular-nums">
            <thead>
              <tr>
                <th className="points-ledger-deficit-text whitespace-nowrap px-2 py-1.5 text-left text-[9px] font-extrabold tracking-[0.4px] opacity-80">
                  RD
                </th>
                <th className="points-ledger-deficit-text whitespace-nowrap px-2 py-1.5 text-left text-[9px] font-extrabold tracking-[0.4px] opacity-80">
                  PICK
                </th>
                <th className="points-ledger-deficit-text whitespace-nowrap px-2 py-1.5 text-right text-[9px] font-extrabold tracking-[0.4px] opacity-80">
                  DVI
                </th>
                <th className="points-ledger-deficit-text whitespace-nowrap px-2 py-1.5 text-right text-[9px] font-extrabold tracking-[0.4px] opacity-80">
                  MAX RD DVI
                </th>
                <th className="points-ledger-deficit-text whitespace-nowrap px-2 py-1.5 text-right text-[9px] font-extrabold tracking-[0.4px] opacity-80">
                  PTS SUBTRACTED
                </th>
                <th className="points-ledger-deficit-text whitespace-nowrap px-2 py-1.5 text-left text-[9px] font-extrabold tracking-[0.4px] opacity-80">
                  NEW PICK
                </th>
              </tr>
            </thead>
            <tbody>
              {deficitVisual.deficitImpact.overallPick.map((pick, idx) => {
                const di = deficitVisual.deficitImpact!;
                const wasSubtracted = di.pointsSubtracted[idx] > 0;
                return (
                  <tr
                    key={idx}
                    className="points-ledger-deficit-divider border-t"
                  >
                    <td className="points-ledger-deficit-text px-2 py-1.75 text-[11.5px] font-bold">
                      R{di.draftRoundInt[idx]}
                    </td>
                    <td className="points-ledger-deficit-text px-2 py-1.75 text-[11.5px] font-semibold">
                      {pick}
                    </td>
                    <td className="points-ledger-deficit-text px-2 py-1.75 text-right text-[11.5px]">
                      {formatNumber(di.aflPointsValue[idx])}
                    </td>
                    <td className="points-ledger-deficit-text px-2 py-1.75 text-right text-[11.5px]">
                      {formatNumber(di.maxDeficitPoints[idx])}
                    </td>
                    <td
                      className={cn(
                        "points-ledger-deficit-text px-2 py-1.75 text-right text-[11.5px]",
                        wasSubtracted && "font-bold",
                      )}
                    >
                      {formatNumber(di.pointsSubtracted[idx])}
                    </td>
                    <td className="points-ledger-deficit-text px-2 py-1.75 text-[11.5px] font-semibold">
                      {wasSubtracted && di.newOverallPick[idx]
                        ? `~ Pick ${di.newOverallPick[idx]}`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
