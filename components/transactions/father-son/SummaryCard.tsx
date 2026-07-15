import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { formatNumber } from "./util";
import { useIsMobile } from "@/hooks/use-mobile";

export function SummaryCard({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="rounded-xl border border-border bg-secondary p-3.5 px-[15px]">
        <div className="flex items-baseline gap-2">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.6px] text-text4">
            Points required
          </div>
          <span className="flex-1" />
          <div className="text-[27px] font-extrabold leading-none tracking-[-0.5px] text-primary tabular-nums">
            {formatNumber(impact.pointsRequired)}
          </div>
        </div>
        <div className="mt-1.75 text-[11.5px] leading-relaxed text-muted-foreground">
          {impact.bidSummary}. {impact.bidSummary2}
        </div>
      </div>
    );
  }

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
