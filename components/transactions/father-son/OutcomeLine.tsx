import { cn } from "@/lib/utils";
import { FatherSonBidImpactResponse } from "@/app/api/type/transaction";
import { formatNumber } from "./util";

export const OutcomeLine = ({
  impact,
  clubName,
}: {
  impact: FatherSonBidImpactResponse;
  clubName: string;
}) => {
  const { displayState } = impact;

  const deficitVisual = impact.overallImpactVisual?.find(
    (v) => v.summary === "Points Deficit",
  );
  const shuffledPick = impact.overallImpactVisual?.find((v) =>
    /pick\s*shuffled\s*backwards/i.test(v.summary),
  );
  const matchNextPick = impact.overallImpactVisual?.find((v) =>
    /matched\s*with\s*next\s*pick/i.test(v.summary),
  );

  const maxPicksToMatch = 2;
  const picksUsedForMatch = impact.overallImpactDict.filter((item) =>
    /pick\s*lost/i.test(item.action ?? ""),
  ).length;

  const getStillToPayBeforeShuffled = () => {
    if (!shuffledPick) return 0;
    const pickItems = impact.overallImpactDict.filter((item) =>
      /pick\s*lost|pick\s*shuffled/i.test(item.action ?? ""),
    );
    let owed = impact.pointsRequired;
    for (const item of pickItems) {
      const pickValue = Number(item.aflPointsValue) || 0;
      if (/shuffle/i.test(item.action)) {
        return owed;
      }
      owed -= pickValue;
    }
    return 0;
  };

  const renderMessage = () => {
    switch (displayState) {
      case "deficit": {
        const pointsDeficit = deficitVisual?.pointsDeficit ?? 0;
        const deficitYear = deficitVisual?.deficitYear;
        const fewerPicksUsed = picksUsedForMatch < maxPicksToMatch;

        return (
          <>
            Clubs can only use <strong>{maxPicksToMatch} picks</strong> to match
            a bid
            {fewerPicksUsed &&
              `, but only ${picksUsedForMatch} pick(s) could be used`}
            , so the last <strong>{formatNumber(pointsDeficit)} pts</strong>{" "}
            become a <strong>deficit</strong> carried into {deficitYear}.
          </>
        );
      }

      case "shuffle_lost": {
        const firstValue = shuffledPick?.firstValue;
        const secondValue = shuffledPick?.secondValue;
        const firstValueTooltip = shuffledPick?.firstValueTooltip;
        const stillToPay = getStillToPayBeforeShuffled();
        const leftover =
          Number(shuffledPick?.firstValueTooltip || 0) - stillToPay;

        return (
          <>
            Bid covered. Pick {firstValue} only needed{" "}
            {formatNumber(stillToPay)} of its {firstValueTooltip} pts, so it
            keeps the <strong>{formatNumber(leftover)} pts</strong> left over
            and <strong>slides back to pick {secondValue}</strong>.
          </>
        );
      }

      case "match_next": {
        const firstValue =
          matchNextPick?.firstValue ?? impact.overallImpactDict[0]?.overallPick;
        const bidPickNo = impact.bidPickNo;

        return (
          <>
            No points needed. {clubName} use their{" "}
            <strong>next pick (Pick {firstValue})</strong>, which moves up to{" "}
            <strong>pick {bidPickNo}</strong> to take the player.
          </>
        );
      }

      case "cannot_proceed": {
        return <>{impact.bidSummary2}</>;
      }

      default:
        return null;
    }
  };

  const message = renderMessage();
  if (!message) return null;

  const bgColorClass = cn(
    "mt-2 rounded-lg px-3 py-2.5 text-center text-[13.5px] font-semibold leading-relaxed",
    {
      deficit: "bg-deficit-bg text-deficit-text-strong",
      shuffle_lost: "bg-success-surface text-success",
      match_next: "bg-success-surface text-success",
      cannot_proceed: "bg-warning-bg text-warning-text",
    }[displayState] ?? "bg-secondary text-muted-foreground",
  );

  return <div className={bgColorClass}>{message}</div>;
};
