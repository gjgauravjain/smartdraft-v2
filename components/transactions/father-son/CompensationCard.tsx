import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { getFinishingPositionSuffix } from "@/lib/utils";

export const CompensationCard = ({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) => {
  const hasCompensation = impact.compensationPicks2026?.length > 0;

  if (!hasCompensation) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground text-lg font-extrabold">
          −
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-extrabold text-foreground">
            Compensation
          </div>
          <div className="text-[11.5px] text-muted-foreground opacity-85 mt-0.5">
            No compensation picks due. No bottom-5 club's first-round pick has
            slid back.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-success-border bg-success-surface p-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-success-border bg-card text-success font-extrabold">
        +
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-extrabold text-success mb-1">
          Compensation picks due
        </div>
        <div className="text-[12px] text-success opacity-85 mb-1.5">
          Each club below gets a pick straight after its own round 2 pick.
        </div>
        <ul className="flex flex-col gap-1 text-[12px] leading-relaxed text-success list-none">
          {impact.compensationPicks2026.map((c) => (
            <li key={c.teamId}>
              <strong>{c.teamName}</strong> ({c.finishingPosition}
              {getFinishingPositionSuffix(c.finishingPosition)}) · first-round
              pick slid back {c.slideSpots} spot
              {c.slideSpots !== 1 ? "s" : ""}{" "}
              <span className="inline-block rounded-full border border-success-border bg-card px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                {c.status === "confirmed" ? "Confirmed" : "Projected"}
              </span>
            </li>
          ))}
        </ul>
        <div className="text-[11.5px] text-success opacity-85 mt-1.5">
          Projected until the club uses that pick. Granted later through Apply
          Compensation.
        </div>
      </div>
    </div>
  );
};
