"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { computeLedgerRows, formatNumber } from "./util";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { useIsMobile } from "@/hooks/use-mobile";
import { PointsLedgerHeader } from "./PointsLedgerHeader";
import { PointsLedgerPicksApplied } from "./PointsLedgerPicksApplied";
import { PointsLedgerDeficit } from "./PointsLedgerDeficit";
import { PointsLedgerStatus } from "./PointsLedgerStatus";

export function PointsLedger({
  impact,
}: {
  impact: FatherSonBidImpactResponse;
}) {
  const isMobile = useIsMobile();
  const [calcsVisible, setCalcsVisible] = useState(false);

  const rows = computeLedgerRows(impact);
  const finalRemaining = rows.length
    ? rows[rows.length - 1].remaining
    : impact.pointsRequired;

  const deficitVisual = impact.overallImpactVisual?.find(
    (v) => v.summary === "Points Deficit" && v.deficitImpact,
  );
  const hasDeficit =
    !!deficitVisual?.deficitImpact && (deficitVisual?.pointsDeficit ?? 0) > 0;

  const isSurplus = !hasDeficit && finalRemaining <= 0;
  const appliedTotal = impact.pointsRequired - finalRemaining;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        isMobile && "rounded-[11px]",
      )}
    >
      <PointsLedgerHeader
        pointsRequired={impact.pointsRequired}
        isMobile={isMobile}
      />

      <PointsLedgerPicksApplied
        rows={rows}
        isMobile={isMobile}
        calcsVisible={calcsVisible}
        onToggleCalcs={() => setCalcsVisible((v) => !v)}
        appliedTotal={appliedTotal}
      />

      {hasDeficit ? (
        deficitVisual && (
          <PointsLedgerDeficit
            deficitVisual={deficitVisual}
            appliedTotal={appliedTotal}
            pointsRequired={impact.pointsRequired}
            isMobile={isMobile}
          />
        )
      ) : (
        <PointsLedgerStatus
          isMobile={isMobile}
          isSurplus={isSurplus}
          appliedTotal={appliedTotal}
          pointsRequired={impact.pointsRequired}
          finalRemaining={finalRemaining}
        />
      )}
    </div>
  );
}
