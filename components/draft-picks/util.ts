import { TabOptionType } from "@/app/api/type/common";
import { DraftYearList, DraftYearType } from "@/app/api/type/draftpicks";

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
