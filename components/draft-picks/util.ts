import { TabOptionType } from "@/app/api/type/common";
import {
  DataOrderEntryType,
  DraftYearList,
  DraftYearType,
} from "@/app/api/type/draftpicks";

export const draftTabOption: TabOptionType[] = [
  {
    label: "Order of Entry",
    value: "order",
  },
  {
    label: "Full Draft List",
    value: "fulllist",
  },
  {
    label: "Draft Assets",
    value: "draftAssets",
  },
];

export const filterPicks = ({
  picks,
  selectedTeamId,
  showAll,
}: {
  picks: DraftYearList[];
  selectedTeamId?: string;
  showAll?: boolean;
}) => {
  if (showAll || !selectedTeamId) {
    return picks;
  }

  return picks.filter((pick) => Number(pick.teamId) === Number(selectedTeamId));
};

type DraftRoundConfig = {
  id: keyof DraftYearType;
  title: string;
};
export const DRAFT_ROUNDS: DraftRoundConfig[] = [
  { id: "rd1List", title: "Round 1" },
  { id: "rd2List", title: "Round 2" },
  { id: "rd3List", title: "Round 3" },
  { id: "rd4List", title: "Round 4" },
  { id: "rd5List", title: "Round 5" },
  { id: "rd6List", title: "Rest of Draft" },
];

export const formatPlayerName = (name?: string) => {
  if (!name) return "";

  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return name;

  return `${words
    .slice(0, -1)
    .map((word) => word[0])
    .join(" ")} ${words[words.length - 1]}`;
};

export const isPlayerName = (value?: string) => {
  if (!value) return false;
  return Number.isNaN(Number(value));
};

export const NAME_COL_WIDTH = 170;
export const COL_WIDTH = 64;

// Decay curve fitted to match the value tooltips in the reference design
// (3000 pts at pick 1, decaying ~3.7% per pick).
export const VALUE_BASE = 3000;
export const VALUE_DECAY = 0.963;

export const GRADIENT_LIGHT: [number, number, number][] = [
  [134, 207, 155],
  [187, 222, 150],
  [235, 220, 142],
  [239, 188, 131],
  [232, 145, 128],
];
export const GRADIENT_DARK: [number, number, number][] = [
  [87, 177, 115],
  [148, 195, 110],
  [207, 185, 95],
  [211, 143, 87],
  [200, 106, 91],
];

function interpolateStop(stops: [number, number, number][], t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  const segs = stops.length - 1;
  const seg = Math.min(segs - 1, Math.floor(clamped * segs));
  const localT = clamped * segs - seg;
  const [r1, g1, b1] = stops[seg];
  const [r2, g2, b2] = stops[seg + 1];
  return [
    Math.round(r1 + (r2 - r1) * localT),
    Math.round(g1 + (g2 - g1) * localT),
    Math.round(b1 + (b2 - b1) * localT),
  ] as const;
}

export function cellBackground(t: number) {
  const [lr, lg, lb] = interpolateStop(GRADIENT_LIGHT, t);
  const [dr, dg, db] = interpolateStop(GRADIENT_DARK, t);
  return `light-dark(rgb(${lr} ${lg} ${lb}), rgb(${dr} ${dg} ${db}))`;
}

export function pickValue(pick: number) {
  return Math.round(VALUE_BASE * Math.pow(VALUE_DECAY, pick - 1));
}

export function getPicks(team: DataOrderEntryType) {
  const picks: number[] = [];
  for (let i = 1; i <= team.totalOrderLength; i++) {
    const value = team[`order_${i}`];
    if (typeof value === "number") picks.push(value);
  }
  return picks;
}

export const TALENT_ORDER_WIDTH = 264;
export const TALENT_ORDER_RAIL_WIDTH = 18;

export const TALENT_ORDER_TABS: TabOptionType[] = [
  {
    value: "picks",
    label: "Picks",
  },
  {
    value: "talent",
    label: "Talent Orders",
  },
];
