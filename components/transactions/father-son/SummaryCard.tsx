import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { formatNumber } from "./util";

export function SummaryCard({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 text-[12.5px] font-medium leading-relaxed text-muted-foreground">
        {impact.bidSummary}. {impact.bidSummary2}
      </div>
      <div>
        <div className="text-[10px] font-extrabold uppercase tracking-wide text-text4">
          Points required
        </div>
        <div className="mt-1 text-[46px] font-extrabold leading-none tracking-tight text-primary tabular-nums">
          {formatNumber(impact.pointsRequired)}
        </div>
      </div>
    </div>
  );
}
