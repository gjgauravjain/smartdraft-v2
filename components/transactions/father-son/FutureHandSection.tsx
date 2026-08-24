import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { cn } from "@/lib/utils";
import { formatNumber } from "./util";

export function FutureHandsSection({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  const rounds = Array.from({ length: 10 }, (_, idx) => idx + 1);
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

  const movedRoundMap = new Map<
    string,
    {
      pointsSubtracted: number;
      newOverallPick: number;
    }
  >();

  if (deficitImpact) {
    deficitImpact.overallPick.forEach((_, idx) => {
      if ((deficitImpact.pointsSubtracted[idx] ?? 0) <= 0) {
        return;
      }
      const key = `${deficitImpact.year[idx]}-${deficitImpact.draftRoundInt[idx]}`;
      movedRoundMap.set(key, {
        pointsSubtracted: deficitImpact.pointsSubtracted[idx],
        newOverallPick: deficitImpact.newOverallPick[idx],
      });
    });
  }

  const deficitRowFor = (year: string, draftRoundInt: number | string) =>
    movedRoundMap.get(`${year}-${Number(draftRoundInt)}`) ?? null;

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
        {years.map((year) => {
          const picksByRound = new Map<
            number,
            (typeof impact.initialDraftHand)[number]
          >();
          byYear
            .get(year)!
            .forEach((p) => picksByRound.set(Number(p.draftRoundInt), p));

          return (
            <div key={year} className="space-y-1.5">
              <div className="text-[10px] font-extrabold tabular-nums text-muted-foreground">
                {year}
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                {rounds.map((roundNo) => {
                  const pick = picksByRound.get(roundNo);
                  const deficitRow = deficitRowFor(year, roundNo);
                  const isDeficit = !!deficitRow;

                  return (
                    <div
                      key={`${year}-${roundNo}`}
                      title={
                        isDeficit
                          ? `deficit −${formatNumber(deficitRow.pointsSubtracted)} applied`
                          : undefined
                      }
                      className={cn(
                        "inline-flex h-6 min-w-0 items-center justify-center gap-1 rounded-full border px-2 py-2 text-[11px] font-bold tabular-nums",
                        !pick && "opacity-55",
                        isDeficit
                          ? "future-hand-deficit-chip"
                          : "border-border bg-card text-foreground",
                      )}
                    >
                      F{roundNo}
                      <span className="truncate text-[9px] font-semibold opacity-78">
                        {isDeficit
                          ? `→ ~${deficitRow.newOverallPick}`
                          : pick
                            ? `(Pick ${pick.overallPick})`
                            : "(No pick)"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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
