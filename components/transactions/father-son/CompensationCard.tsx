import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";

export function CompensationCard({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  if (!impact.compensationPicks2026?.length) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-success-border bg-success-surface p-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-success-border bg-card text-success">
        +
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="whitespace-nowrap text-[12.5px] font-extrabold text-success">
            Potential compensation
          </span>
          <span className="rounded-full border border-success-border bg-card px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-success">
            Projected
          </span>
        </div>
        <div className="flex flex-col gap-1 text-[12px] leading-relaxed text-success">
          {impact.compensationPicks2026.map((c) => (
            <div key={c.teamId}>
              {c.teamName} may slide {c.slideSpots} spot
              {c.slideSpots !== 1 ? "s" : ""} — inserted{" "}
              {c.insertRelativeToR2.toLowerCase()} Round 2 ({c.status})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
