import { AlertTriangle } from "lucide-react";
import { ImpactVisualType } from "@/app/api/type/transaction";
import { formatNumber } from "./util";

export const DeficitCard = ({
  deficitVisual,
  clubName,
  currentYear,
}: {
  deficitVisual: ImpactVisualType;
  clubName: string;
  currentYear: number;
}) => {
  const deficitImpact = deficitVisual.deficitImpact;
  if (!deficitImpact) return null;

  const pointsDeficit = deficitVisual.pointsDeficit ?? 0;
  const deficitYear = deficitVisual.deficitYear;

  const firstDeficitIdx = deficitImpact.pointsSubtracted.findIndex(
    (p) => p > 0,
  );
  if (firstDeficitIdx === -1) return null;

  const overallPick = deficitImpact.overallPick[firstDeficitIdx];
  const aflPointsValue = deficitImpact.aflPointsValue[firstDeficitIdx];
  const pointsSubtracted = deficitImpact.pointsSubtracted[firstDeficitIdx];
  const pointsRemaining = deficitImpact.pointsRemaining[firstDeficitIdx];
  const newOverallPick = deficitImpact.newOverallPick[firstDeficitIdx];

  const hasExactFields = "exact_new_overall_pick" in (deficitImpact as any);
  const overallPickWithoutTasmania = (deficitImpact as any)
    .overall_pick_without_tasmania?.[firstDeficitIdx];
  const pointsValueWithoutTasmania = (deficitImpact as any)
    .points_value_without_tasmania?.[firstDeficitIdx];
  const pointsRemainingWithoutTasmania = (deficitImpact as any)
    .points_remaining_without_tasmania?.[firstDeficitIdx];
  const newOverallPickWithoutTasmania = (deficitImpact as any)
    .new_overall_pick_without_tasmania?.[firstDeficitIdx];
  const exactNewOverallPick = (deficitImpact as any).exact_new_overall_pick?.[
    firstDeficitIdx
  ];

  const pickMoves = hasExactFields
    ? exactNewOverallPick !== overallPick
    : newOverallPick !== overallPick;
  const finalPick = hasExactFields ? exactNewOverallPick : newOverallPick;

  const committedDeficitPoints =
    (deficitImpact as any).committed_deficit_points ?? 0;
  const allowableDeficitPoints = deficitVisual.allowableDeficitPoints ?? 412;
  const totalDeficitUsed = committedDeficitPoints + pointsDeficit;

  const hasWarning =
    deficitVisual.deficitExceedsCap ||
    deficitVisual.missingNextYearFirstRounder;
  const warningMessage = deficitVisual.missingNextYearFirstRounder
    ? "This club does not hold its next-year first-round pick, so this deficit would not be permitted under AFL rules."
    : (deficitVisual.deficitWarning ??
      `This deficit exceeds the allowable cap of ${formatNumber(allowableDeficitPoints)} pts.`);

  const clubPossessive = clubName.endsWith("s")
    ? `${clubName}'`
    : `${clubName}'s`;

  let workingExplanation = "";
  if (hasExactFields && overallPickWithoutTasmania != null) {
    if (pickMoves) {
      workingExplanation = `The deficit is applied against ${clubPossessive} ${deficitYear} Round 1 pick (pick ${overallPick}). Without Tasmania's concession picks it's pick ${overallPickWithoutTasmania}, worth ${formatNumber(pointsValueWithoutTasmania)} pts: ${formatNumber(pointsValueWithoutTasmania)} - ${formatNumber(pointsSubtracted)} = ${formatNumber(pointsRemainingWithoutTasmania)} pts, the value of pick ${newOverallPickWithoutTasmania}. With Tasmania's picks added back, it lands at pick ${exactNewOverallPick}.`;
    } else {
      workingExplanation = `The deficit is applied against ${clubPossessive} ${deficitYear} Round 1 pick (pick ${overallPick}). Without Tasmania's concession picks it's pick ${overallPickWithoutTasmania}, worth ${formatNumber(pointsValueWithoutTasmania)} pts: ${formatNumber(pointsValueWithoutTasmania)} - ${formatNumber(pointsSubtracted)} = ${formatNumber(pointsRemainingWithoutTasmania)} pts, so it doesn't move and stays pick ${overallPick}.`;
    }
  } else {
    if (pickMoves) {
      workingExplanation = `The deficit is applied against ${clubPossessive} ${deficitYear} Round 1 pick (pick ${overallPick}), worth ${formatNumber(aflPointsValue)} pts: ${formatNumber(aflPointsValue)} - ${formatNumber(pointsSubtracted)} = ${formatNumber(pointsRemaining)} pts, the value of pick ${newOverallPick}.`;
    } else {
      workingExplanation = `The deficit is applied against ${clubPossessive} ${deficitYear} Round 1 pick (pick ${overallPick}), worth ${formatNumber(aflPointsValue)} pts: ${formatNumber(aflPointsValue)} - ${formatNumber(pointsSubtracted)} = ${formatNumber(pointsRemaining)} pts, so it doesn't move and stays pick ${overallPick}.`;
    }
  }

  return (
    <div className="rounded-xl border border-deficit-border bg-deficit-bg p-3.5 text-deficit-text-strong">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <div className="text-[14px] font-extrabold text-deficit-text">
          <span className="text-[10.5px] uppercase tracking-wide text-deficit-text-accent mr-1.5">
            Points Deficit
          </span>
          {formatNumber(pointsDeficit)} pts carried into {deficitYear}
        </div>
        <div className="rounded-full bg-deficit-pill px-2.5 py-1 text-[14px] font-extrabold text-deficit-text tabular-nums">
          {pickMoves ? (
            <>
              Pick {overallPick} <span className="opacity-70">→</span>{" "}
              {finalPick}
            </>
          ) : (
            <>Stays pick {overallPick}</>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-deficit-border-subtle bg-card px-3 py-2 text-[12.5px] leading-relaxed mb-2 text-foreground">
        {workingExplanation}
      </div>

      {hasWarning && (
        <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-bg px-2.5 py-2 mb-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-text" />
          <div className="text-[10.5px] leading-snug text-warning-text">
            {warningMessage}
          </div>
        </div>
      )}

      <div className="text-[11.5px] text-deficit-text-muted">
        <span className="inline-block rounded-full border border-deficit-border bg-card px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-deficit-text mr-1.5">
          Projected
        </span>
        {deficitYear} order from {currentYear} standings, recalculated after the{" "}
        {deficitYear} H&A season. Deficit used:{" "}
        <strong className="text-deficit-text-strong">
          {formatNumber(totalDeficitUsed)} of{" "}
          {formatNumber(allowableDeficitPoints)} pts
        </strong>{" "}
        allowed.
      </div>
    </div>
  );
};
