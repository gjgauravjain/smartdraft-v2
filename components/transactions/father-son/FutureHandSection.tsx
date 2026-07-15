import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { cn } from "@/lib/utils";
import { formatNumber } from "./util";

export function FutureHandsSection({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  const byYear = new Map<string, typeof impact.initialDraftHand>();
  impact.initialDraftHand
    .filter((p) => p.yearType === "Next")
    .forEach((p) => {
      const key = String(p.year);
      if (!byYear.has(key)) byYear.set(key, []);
      byYear.get(key)!.push(p);
    });
  const years = Array.from(byYear.keys()).sort();

  const deficitVisual = impact.overallImpactVisual?.find(
    (v) => v.summary === "Points Deficit" && v.deficitImpact,
  );
  const deficitImpact = deficitVisual?.deficitImpact;

  const deficitRowFor = (year: string, draftRoundInt: number | string) => {
    if (!deficitImpact) return null;
    const idx = deficitImpact.overallPick.findIndex(
      (_, i) =>
        deficitImpact.year[i] === year &&
        Number(deficitImpact.draftRoundInt[i]) === Number(draftRoundInt) &&
        deficitImpact.pointsSubtracted[i] > 0,
    );
    if (idx === -1) return null;
    return {
      pointsSubtracted: deficitImpact.pointsSubtracted[idx],
      newOverallPick: deficitImpact.newOverallPick[idx],
    };
  };

  // For the footer note: find the single pick that absorbed the deficit.
  const absorbingPick = deficitImpact
    ? (() => {
        const idx = deficitImpact.pointsSubtracted.findIndex((p) => p > 0);
        if (idx === -1) return null;
        return {
          year: deficitImpact.year[idx],
          round: deficitImpact.draftRoundInt[idx],
          newOverallPick: deficitImpact.newOverallPick[idx],
        };
      })()
    : null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="whitespace-nowrap text-[10.5px] font-extrabold uppercase tracking-wide text-text4">
          Future hands
        </div>
        <span className="text-[9.5px] text-text4">ladder-projected</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        {years.map((year) => (
          <div key={year} className="flex flex-wrap items-center gap-1.5">
            <span className="w-8.5 shrink-0 text-[10px] font-extrabold tabular-nums text-muted-foreground">
              {year}
            </span>
            {byYear
              .get(year)!
              .sort((a, b) => Number(a.draftRoundInt) - Number(b.draftRoundInt))
              .map((p, idx) => {
                const deficitRow = deficitRowFor(year, p.draftRoundInt);
                const isDeficit = !!deficitRow;

                return (
                  <div
                    key={idx}
                    title={
                      isDeficit
                        ? `deficit −${formatNumber(deficitRow!.pointsSubtracted)} applied`
                        : undefined
                    }
                    className={cn(
                      "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px] font-bold tabular-nums",
                      isDeficit
                        ? "future-hand-deficit-chip"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    F{p.draftRoundInt}
                    <span className={cn("text-[9px] font-semibold opacity-78")}>
                      {isDeficit
                        ? `→ ~${deficitRow!.newOverallPick}`
                        : `(Pick ${p.overallPick})`}
                    </span>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {absorbingPick && (
        <div className="future-hand-deficit-note mt-2 text-[10.5px]">
          {absorbingPick.year} F{absorbingPick.round} absorbs the carried
          deficit (−{formatNumber(deficitVisual?.pointsDeficit ?? 0)} pts) —
          lands ~Pick {absorbingPick.newOverallPick}.
        </div>
      )}
    </div>
  );
}
