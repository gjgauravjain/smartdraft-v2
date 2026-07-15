import { PlayerDatabaseType } from "@/app/api/type/player";
import {
  FatherSonBidImpactResponse,
  OverallImpactItem,
} from "@/app/api/type/transaction";
import { BoardCategory, BoardPlayer } from "./type";

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

export const CATEGORY_FILTERS: { key: BoardCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fs", label: "F/S" },
  { key: "academy", label: "Academy" },
  { key: "nga", label: "NGA" },
];

export function getPlayerCategory(player: BoardPlayer): BoardCategory {
  const types = (player.elegibility ?? [])
    .map((e) => e.eligibilityType?.toLowerCase() ?? "")
    .join(" ");
  if (/father|son|f\/s/.test(types)) return "fs";
  if (/academy/.test(types)) return "academy";
  if (/nga|next generation/.test(types)) return "nga";
  return "all";
}

export function getInitials(player: BoardPlayer) {
  const first = player.preferredFirstName || player.firstName || "";
  const last = player.preferredLastName || player.lastName || "";
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function getDisplayName(player: BoardPlayer) {
  const first = player.preferredFirstName || player.firstName;
  const last = player.preferredLastName || player.lastName;
  return `${first} ${last}`.trim();
}

export function getTag(player: BoardPlayer) {
  const category = getPlayerCategory(player);
  if (category === "fs") {
    const abbrev = player.currentRoasterAllocation?.teamId ?? "";
    return `F/S${abbrev ? ` · ${abbrev}` : ""}`;
  }
  if (category === "academy") return "Academy";
  if (category === "nga") return "NGA";
  return null;
}
