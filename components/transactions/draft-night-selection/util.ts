import { DraftNightSelectionRequest } from "@/app/api/type/draft-night-selection";
import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { DraftPoolPlayer } from "@/app/api/type/player";
import axios from "axios";
import { DraftNightSelectionFormValues } from "./type";

export const DRAFT_NIGHT_DEFAULT_VALUES: DraftNightSelectionFormValues = {
  pickId: "",
  playerId: "",
};

export const DRAFT_NIGHT_SERVER_ERROR =
  "Something went wrong. Check the details and try again.";

export const DRAFT_NIGHT_SUCCESS_FALLBACK = "Player Drafted Successfully";

export const availableDraftPicks = (picks: DraftPicksDataType[]) =>
  picks
    .filter((pick) => pick.pickStatus !== "Used")
    .sort(
      (left, right) =>
        left.year - right.year || left.overallPick - right.overallPick,
    );

export const pickYears = (
  picks: DraftPicksDataType[],
  projectYear: number | null,
) => {
  const years = new Set(picks.map((pick) => pick.year));
  if (projectYear !== null) years.add(projectYear);
  return [...years].sort((left, right) => left - right);
};

export const filterDraftPicks = (
  picks: DraftPicksDataType[],
  year: number | null,
  query: string,
) => {
  const search = query.trim().toLowerCase();
  return picks.filter((pick) => {
    if (year !== null && pick.year !== year) return false;
    if (!search) return true;
    return `${pick.label} ${pick.display}`.toLowerCase().includes(search);
  });
};

export const teamForOwner = (teams: TeamType[], ownerId: number) =>
  teams.find((team) => team.id === String(ownerId)) ?? null;

export const formatRank = (rank: number | null) =>
  rank === null ? "" : `#${rank}`;

export const playerMeta = (player: DraftPoolPlayer) => {
  const rank = formatRank(player.rank);
  if (player.position && rank) return `${player.position} · ${rank}`;
  return player.position || rank;
};

export const buildDraftNightRequest = (
  pick: DraftPicksDataType | null,
  player: DraftPoolPlayer | null,
): DraftNightSelectionRequest | null => {
  if (!pick || !player || !player.displayName.trim()) return null;
  const selectedPickId = Number(pick.value);
  if (!Number.isInteger(selectedPickId) || !Number.isInteger(player.id)) {
    return null;
  }
  return {
    player_taken_id: player.displayName,
    selected_pick_id: selectedPickId,
    player_id: player.id,
  };
};

const messageField = (data: unknown) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "";
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message.trim() : "";
};

const pushMessage = (messages: string[], value: unknown) => {
  if (typeof value === "string" && value.trim()) {
    messages.push(value.trim());
    return;
  }
  if (!Array.isArray(value)) return;
  value.forEach((item) => {
    if (typeof item === "string" && item.trim()) messages.push(item.trim());
  });
};

const messagesFromBody = (data: unknown) => {
  if (Array.isArray(data)) {
    const messages: string[] = [];
    pushMessage(messages, data);
    return messages;
  }
  if (!data || typeof data !== "object") return [];
  const messages: string[] = [];
  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (key === "code") return;
    pushMessage(messages, value);
  });
  return messages;
};

export const draftNightErrorMessages = (error: unknown) => {
  if (!axios.isAxiosError(error)) return [DRAFT_NIGHT_SERVER_ERROR];
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 400) {
    const messages = messagesFromBody(data);
    if (messages.length) return messages;
  }

  if (status === 404) {
    const message = messageField(data);
    if (message) return [message];
  }

  return [DRAFT_NIGHT_SERVER_ERROR];
};

export const draftNightSuccessMessage = (data: unknown) => {
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    typeof data.success === "string" &&
    data.success.trim()
  ) {
    return data.success;
  }
  return DRAFT_NIGHT_SUCCESS_FALLBACK;
};

export const pickOptionGridClass = (isMobile: boolean) => {
  if (isMobile) {
    return "grid w-full cursor-pointer grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-2 border-b border-border/70 px-2.5 py-[7px] text-left text-[12.5px] last:border-b-0";
  }
  return "grid w-full cursor-pointer grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-border/70 px-2.5 py-[7px] text-left text-[12.5px] last:border-b-0";
};

export const playerOptionGridClass = (isMobile: boolean) => {
  if (isMobile) {
    return "grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_32px] items-center gap-2 border-b border-border/70 px-2.5 py-[7px] text-left text-[12.5px] last:border-b-0";
  }
  return "grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_36px] items-center gap-2.5 border-b border-border/70 px-2.5 py-[7px] text-left text-[12.5px] last:border-b-0";
};

export const optionSelectedClass = (selected: boolean) =>
  selected ? "bg-primary-light" : "hover:bg-muted";

export const selectTriggerClass = (open: boolean, hasValue: boolean) => {
  const border = open ? "border-primary" : "border-border";
  const color = hasValue ? "text-foreground" : "text-muted-foreground";
  return `flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-[7px] border bg-card px-2.5 py-[5px] text-left text-[13px] ${border} ${color}`;
};

export const selectPanelClass = () =>
  "mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-md";

export const selectFooterClass = () =>
  "border-t border-border bg-muted px-2.5 py-1.5 text-[11.5px] leading-normal text-muted-foreground";

export const searchInputClass = () =>
  "w-full border-0 border-b border-border bg-transparent px-2.5 py-[9px] text-[13px] text-foreground outline-none placeholder:text-muted-foreground";

export const optionsListClass = () => "max-h-[232px] overflow-y-auto";

export const emptyOptionClass = () =>
  "px-2.5 py-2 text-[12.5px] text-muted-foreground";

export const pickChipClass = (fill: boolean) => {
  const base =
    "h-6 truncate rounded-[5px] border border-border bg-muted px-1.5 text-center text-[11.5px] font-semibold tabular-nums leading-[22px] text-foreground";
  if (fill) return `block w-full ${base}`;
  return `inline-block min-w-10 max-w-full shrink-0 ${base}`;
};

export const clubBadgeClass = () =>
  "inline-grid h-[18px] min-w-[34px] shrink-0 place-items-center rounded bg-muted px-1 text-[9.5px] font-extrabold tracking-[0.3px] text-muted-foreground";

export const yearChipClass = (selected: boolean) => {
  if (selected) {
    return "h-[26px] cursor-pointer rounded-md border border-foreground bg-foreground px-2.5 text-[11.5px] font-semibold text-background";
  }
  return "h-[26px] cursor-pointer rounded-md border border-border bg-card px-2.5 text-[11.5px] font-semibold text-foreground";
};

export const summaryGridClass = (isMobile: boolean) => {
  if (isMobile) return "grid grid-cols-1 items-center gap-1.5";
  return "grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] items-center gap-3";
};

export const summaryArrowClass = (isMobile: boolean) => {
  if (isMobile) {
    return "w-4 rotate-90 text-left text-[15px] text-muted-foreground";
  }
  return "text-center text-[15px] text-muted-foreground";
};

export const actionRowClass = (isMobile: boolean) => {
  if (isMobile) {
    return "flex shrink-0 gap-2 border-t border-border bg-card px-4 py-2.5 pb-6.5";
  }
  return "flex shrink-0 justify-end gap-2 border-t border-border bg-card px-5 py-3";
};

export const actionButtonClass = (isMobile: boolean) => {
  if (isMobile) return "h-9 flex-1 rounded-lg text-[13px] font-semibold";
  return "h-9 rounded-lg text-[13px] font-semibold";
};

export const fieldLabelClass = () =>
  "text-[10px] font-bold uppercase tracking-[0.7px] text-muted-foreground";
