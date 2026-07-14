import {
  FatherSonBidImpactResponse,
  OverallImpactItem,
} from "@/app/api/type/transaction";

export const DISPLAY_STATES = [
  { key: "shuffle_lost", letter: "A", label: "Shuffle + lost" },
  { key: "deficit", letter: "B", label: "Points deficit" },
  { key: "match_next", letter: "C", label: "Match next pick" },
  { key: "cannot_proceed", letter: "D", label: "Cannot proceed" },
  { key: "board_source", letter: "E", label: "Board source" },
] as const;

export function playerName(p: any) {
  return `${p.preferredFirstName || p.firstName} ${p.preferredLastName || p.lastName}`;
}

export function parseRound(label: string) {
  const match = label?.match(/RD(\d+)/i);
  return match ? Number(match[1]) : null;
}

export function formatNumber(n: number) {
  return n.toLocaleString("en-AU");
}

export function computeLedgerRows(impact: FatherSonBidImpactResponse) {
  let owed = impact.pointsRequired;
  return impact.overallImpactDict.map((item) => {
    const pickValue = Number(item.aflPointsValue) || 0;
    const owedBefore = owed;
    const remaining = owedBefore - pickValue;
    owed = Math.max(remaining, 0);
    return {
      item,
      pickValue,
      owedBefore,
      remaining,
      isLost: /lost/i.test(item.action),
      isShuffled: /shuffle/i.test(item.action),
    };
  });
}

export function buildBeforeChips(impact: FatherSonBidImpactResponse) {
  const impactByPick = new Map<string, OverallImpactItem>(
    impact.overallImpactDict.map((i) => [String(i.overallPick), i]),
  );
  return impact.initialDraftHand
    .filter((p) => p.yearType === "Current")
    .sort((a, b) => Number(a.overallPick) - Number(b.overallPick))
    .map((p) => ({
      pick: p.overallPick,
      impact: impactByPick.get(String(p.overallPick)),
    }));
}

export function buildAfterChips(impact: FatherSonBidImpactResponse) {
  return impact.newDraftHand
    .filter((p) => p.yearType === "Current")
    .sort((a, b) => Number(a.overallPick) - Number(b.overallPick))
    .map((p) => ({ pick: p.overallPick, used: p.pickStatus === "Used" }));
}
