import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import {
  BidMatchKind,
  CompensationPick,
  DraftHandPick,
  FatherSonBidImpactResponse,
  ImpactVisualType,
} from "@/app/api/type/transaction";
import {
  BidChip,
  BidChipTone,
  BidCostRow,
  BidHandYear,
  BidMatchBox,
  BidMatchFormValues,
  BidMatchResult,
} from "./type";

export const BID_MATCH_ERROR =
  "Something went wrong. Check the details and try again.";

export const BID_MATCH_DEFAULTS: BidMatchFormValues = {
  teamId: "",
  playerId: "",
  pickId: "",
};

export const BID_MATCH_CONFIG: Record<
  BidMatchKind,
  {
    eyebrow: string;
    title: string;
    clubLabel: string;
    selectionLabel: string;
  }
> = {
  fatherSon: {
    eyebrow: "Father Son bid",
    title: "Match the bid",
    clubLabel: "Father-son club",
    selectionLabel: "Father-son selection",
  },
  academy: {
    eyebrow: "Academy bid",
    title: "Match the bid",
    clubLabel: "Academy club",
    selectionLabel: "Academy selection",
  },
  nga: {
    eyebrow: "NGA bid",
    title: "Match the bid",
    clubLabel: "NGA club",
    selectionLabel: "NGA selection",
  },
};

export const formatPoints = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "";
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return String(value);
  return numeric.toLocaleString("en-AU", { maximumFractionDigits: 1 });
};

export const pickOptionLabel = (pick: DraftPicksDataType) =>
  pick.label || pick.display;

const visualLabel = (item: ImpactVisualType) => item.display?.trim() ?? "";

const handLabel = (row: DraftHandPick) => row.display?.trim() ?? "";

const inListedRounds = (row: DraftHandPick) => {
  const round = Number(row.draftRoundInt);
  return round >= 1 && round <= 6;
};

const chipTone = (
  row: DraftHandPick,
  projectYear: number | null,
): BidChipTone => {
  if (row.matchRole === "father_son") return "selection";
  if (row.deficitNewPick) return "deficit";
  if (row.matchRole === "slid") return "slid";
  if (row.matchRole === "used") return "used";
  const year = Number(row.year);
  if (projectYear && Number.isFinite(year) && year > projectYear)
    return "future";
  if (row.yearType === "Next") return "future";
  return "held";
};

const deduction = (value: number | string | null | undefined) => {
  const formatted = formatPoints(value);
  if (!formatted) return "";
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric < 0) return formatted;
  return `−${formatted.replace(/^-/, "")}`;
};

const spotsLabel = (impact: FatherSonBidImpactResponse) => {
  const parts: string[] = [];
  if (typeof impact.listSpotsAvailable === "number") {
    parts.push(`${impact.listSpotsAvailable} list spots`);
  }
  if (typeof impact.maxPicksToMatch === "number") {
    parts.push(`up to ${impact.maxPicksToMatch} picks`);
  }
  return parts.join(" · ");
};

const matchBox = (
  impact: FatherSonBidImpactResponse,
  deficitPoints: number,
): BidMatchBox => {
  const visual = impact.overallImpactVisual;
  const rows: BidMatchBox["rows"] = [];
  const used = visual.filter((item) => item.summary === "Pick Lost");
  const slid = visual.filter(
    (item) => item.summary === "Pick Shuffled Backwards",
  );
  const next = visual.filter(
    (item) => item.summary === "Matched with next Pick",
  );
  const deficit = visual.find((item) => item.summary === "Points Deficit");

  const chipsFor = (items: ImpactVisualType[], tone: BidChipTone) =>
    items.flatMap((item, index) => {
      const label = visualLabel(item);
      if (!label) return [];
      return [
        {
          key: `${item.summary}-${label}-${index}`,
          label,
          tone,
        },
      ];
    });

  if (used.length) {
    rows.push({
      key: "uses",
      label: "Uses",
      chips: chipsFor(used, "held"),
      note: "",
    });
  }
  if (slid.length) {
    rows.push({
      key: "slid",
      label: "Slid",
      chips: chipsFor(slid, "slid"),
      note: "",
    });
  }
  if (next.length) {
    rows.push({
      key: "next",
      label: "Next pick",
      chips: chipsFor(next, "held"),
      note: "",
    });
  }
  if (deficit || impact.deficitPickNote) {
    const deficitChip = deficit ? visualLabel(deficit) : "";
    rows.push({
      key: "deficit",
      label: "Deficit",
      chips: deficitChip
        ? [{ key: "deficit-pick", label: deficitChip, tone: "deficit" }]
        : [],
      note: impact.deficitPickNote ?? "",
    });
  }

  if (!impact.canProceed) {
    return {
      tone: "blocked",
      title: "Match not available",
      detail: impact.blockReason || impact.bidSummary2 || "",
      rows,
      note: impact.matchNote ?? "",
    };
  }

  if (deficitPoints > 0) {
    return {
      tone: "deficit",
      title: `Match available with a ${formatPoints(deficitPoints)} pt deficit`,
      detail: "",
      rows,
      note: impact.matchNote ?? "",
    };
  }

  return {
    tone: "available",
    title: "Match available",
    detail: "",
    rows,
    note: impact.matchNote ?? "",
  };
};

const costRows = (
  impact: FatherSonBidImpactResponse,
  deficitPoints: number,
): BidCostRow[] => {
  const paid = impact.overallImpactVisual.filter(
    (item) =>
      item.summary === "Pick Lost" ||
      item.summary === "Pick Shuffled Backwards" ||
      item.summary === "Matched with next Pick" ||
      item.summary === "Points Deficit",
  );
  if (!paid.length) return [];

  const rows: BidCostRow[] = [
    {
      key: "required",
      label: "Points required",
      detail: "",
      points: formatPoints(impact.pointsRequired),
      remaining: formatPoints(impact.pointsRequired),
      tone: "total",
    },
  ];

  impact.overallImpactVisual.forEach((item, index) => {
    if (
      item.summary !== "Pick Lost" &&
      item.summary !== "Pick Shuffled Backwards" &&
      item.summary !== "Matched with next Pick"
    ) {
      return;
    }
    rows.push({
      key: `pick-${index}`,
      label: visualLabel(item) || item.summary,
      detail: "",
      points: deduction(item.firstValueTooltip),
      remaining: formatPoints(item.pointsRemaining),
      tone: "plain",
    });
  });

  const deficit = impact.overallImpactVisual.find(
    (item) => item.summary === "Points Deficit",
  );
  if (deficit && deficitPoints > 0) {
    rows.push({
      key: "deficit",
      label: deficit.deficitYear
        ? `Carried to ${deficit.deficitYear}`
        : "Deficit",
      detail: "",
      points: formatPoints(deficitPoints),
      remaining: formatPoints(deficit.pointsRemaining),
      tone:
        deficit.deficitExceedsCap || !impact.canProceed ? "over" : "deficit",
    });
  }

  return rows;
};

const handYears = (
  impact: FatherSonBidImpactResponse,
  playerName: string,
  projectYear: number | null,
): BidHandYear[] => {
  const fresh = impact.newDraftHand.filter(inListedRounds);
  const freshKeys = new Set(
    fresh.map((row) => `${row.year}-${row.overallPick}`),
  );
  const used = impact.initialDraftHand.filter(
    (row) =>
      inListedRounds(row) &&
      row.matchRole === "used" &&
      !freshKeys.has(`${row.year}-${row.overallPick}`),
  );

  const grouped = new Map<string, BidChip[]>();
  const push = (row: DraftHandPick, source: string, index: number) => {
    const label = handLabel(row);
    if (!label) return;
    const year = String(row.year);
    const chips = grouped.get(year) ?? [];
    const tone = chipTone(row, projectYear);
    chips.push({
      key: `${source}-${year}-${label}-${index}`,
      label,
      tone,
      name: tone === "selection" ? playerName : undefined,
    });
    grouped.set(year, chips);
  };

  used.forEach((row, index) => push(row, "used", index));
  fresh.forEach((row, index) => push(row, "hand", index));

  return [...grouped.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([year, chips]) => {
      const before = impact.handPoints?.before?.[year];
      const after = impact.handPoints?.after?.[year];
      let points = "";
      if (typeof before === "number" && typeof after === "number") {
        points =
          before === after
            ? formatPoints(after)
            : `${formatPoints(before)} → ${formatPoints(after)}`;
      } else if (typeof after === "number") {
        points = formatPoints(after);
      } else if (typeof before === "number") {
        points = formatPoints(before);
      }
      return { year, points, chips };
    });
};

const legendFor = (hand: BidHandYear[], selectionLabel: string) => {
  const tones = new Set(
    hand.flatMap((year) => year.chips.map((chip) => chip.tone)),
  );
  const legend: string[] = [];
  if (tones.has("used")) legend.push("Used");
  if (tones.has("selection")) legend.push(selectionLabel);
  if (tones.has("deficit")) legend.push("Deficit-adjusted");
  if (tones.has("slid")) legend.push("Slid");
  return legend;
};

const compensationLine = (picks: CompensationPick[]) => {
  if (!picks.length) return "Compensation picks: none.";
  const names = picks
    .map((pick) => pick.teamName)
    .filter(Boolean)
    .join(", ");
  const status = picks.every((pick) => pick.status === "confirmed")
    ? "confirmed"
    : picks.find((pick) => pick.status)?.status || "projected";
  return `Compensation picks (${status}): ${names}.`;
};

export const buildBidMatchResult = (
  impact: FatherSonBidImpactResponse,
  clubName: string,
  playerName: string,
  projectYear: number | null,
  selectionLabel: string,
): BidMatchResult => {
  const club = clubName || "Club";
  const deficitItem = impact.overallImpactVisual.find(
    (item) => item.summary === "Points Deficit",
  );
  const deficitPoints = Number(
    deficitItem?.pointsDeficit ?? impact.committedDeficitPoints ?? 0,
  );
  const headline =
    impact.displayState === "match_next"
      ? `${club} uses its next pick to match.`
      : `${club} needs ${formatPoints(impact.pointsRequired)} pts to match.`;
  const hand = handYears(impact, playerName, projectYear);

  return {
    headline,
    basis: impact.pointsBasis ?? "",
    spots: spotsLabel(impact),
    box: matchBox(impact, Number.isFinite(deficitPoints) ? deficitPoints : 0),
    cost: costRows(impact, Number.isFinite(deficitPoints) ? deficitPoints : 0),
    hand,
    legend: legendFor(hand, selectionLabel),
    compensation: compensationLine(impact.compensationPicks2026),
    canProceed: impact.canProceed,
  };
};

export const chipClass = (tone: BidChipTone) => {
  if (tone === "used") {
    return "bg-muted text-muted-foreground line-through";
  }
  if (tone === "selection") {
    return "bg-success-surface text-success-foreground";
  }
  if (tone === "deficit") {
    return "bg-warning-bg text-warning-text";
  }
  if (tone === "slid") {
    return "bg-primary-light text-primary";
  }
  if (tone === "future") {
    return "border border-dashed border-border bg-transparent text-muted-foreground";
  }
  return "bg-muted text-foreground";
};

export const boxClass = (tone: BidMatchBox["tone"]) => {
  if (tone === "available") {
    return "border-success-foreground/30 bg-success-surface text-success-foreground";
  }
  if (tone === "deficit") {
    return "border-warning-text/30 bg-warning-bg text-warning-text";
  }
  return "border-destructive/30 bg-destructive/10 text-destructive";
};

export const costRowClass = (tone: BidCostRow["tone"]) => {
  if (tone === "total") return "font-semibold text-foreground";
  if (tone === "deficit") return "text-warning-text";
  if (tone === "over") return "text-destructive";
  return "text-foreground";
};
