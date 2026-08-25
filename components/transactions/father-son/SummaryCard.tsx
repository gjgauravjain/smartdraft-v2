import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { useIsMobile } from "@/hooks/use-mobile";

export function SummaryCard({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={
        isMobile
          ? "rounded-xl border border-border bg-secondary p-3.5 px-[15px]"
          : "rounded-xl border border-border bg-card p-4"
      }
    >
      <div
        className={
          isMobile
            ? "text-[11.5px] leading-relaxed text-muted-foreground"
            : "text-[12.5px] font-medium leading-relaxed text-muted-foreground"
        }
      >
        {impact.bidSummary}. {impact.bidSummary2}
      </div>
    </div>
  );
}
