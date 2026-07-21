import { PassPickImpactResponse } from "@/app/api/type/pass-pick";
import { cn } from "@/lib/utils";

type PassPickImpactPreviewProps = {
  impactData: PassPickImpactResponse;
  showAllPicksWarning?: boolean;
};

export function PassPickImpactPreview({
  impactData,
  showAllPicksWarning = false,
}: PassPickImpactPreviewProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/30 p-4">
      {showAllPicksWarning && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs leading-relaxed text-destructive">
          You are about to pass every remaining pick for this club. This action
          cannot be undone.
        </div>
      )}

      {impactData.passSummary ? (
        <p className="text-center text-sm leading-relaxed text-foreground">
          {impactData.passSummary}
        </p>
      ) : (
        <p className="text-center text-sm font-semibold text-foreground">
          The following picks will be passed
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {impactData.picksPassed.map((pick) => (
          <span
            key={pick}
            className={cn(
              "inline-flex items-center rounded-full border border-success-border bg-success-surface px-2.5 py-1 text-xs font-semibold text-success",
            )}
          >
            {pick}
          </span>
        ))}
      </div>
    </div>
  );
}
