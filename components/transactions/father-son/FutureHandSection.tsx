import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";

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

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="whitespace-nowrap text-[10.5px] font-extrabold uppercase tracking-wide text-text4">
          Future hands
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        {years.map((year) => (
          <div key={year} className="flex flex-wrap items-center gap-1.5">
            <span className="w-9 shrink-0 text-[10px] font-extrabold tabular-nums text-muted-foreground">
              {year}
            </span>
            {byYear
              .get(year)!
              .sort((a, b) => Number(a.draftRoundInt) - Number(b.draftRoundInt))
              .map((p, idx) => (
                <div
                  key={idx}
                  className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-card px-2 text-[11px] font-bold tabular-nums text-foreground"
                >
                  R{p.draftRoundInt}
                  <span className="text-[9px] font-semibold opacity-70">
                    (Pick {p.overallPick})
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
