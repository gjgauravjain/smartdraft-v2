import { TeamType } from "@/app/api/type/common";
import axios from "axios";

export const APPLY_COMPENSATION_SERVER_ERROR =
  "Something went wrong. Check the details and try again.";

export const APPLY_COMPENSATION_SUCCESS_FALLBACK =
  "Compensation picks applied successfully.";

export const APPLY_COMPENSATION_LOADING =
  "Checking which compensation picks are due.";

export const APPLY_COMPENSATION_EMPTY = "No compensation picks are due.";

export const APPLY_COMPENSATION_INTRO =
  "These compensation picks will be added to the draft. This can't be undone here.";

export const applyButtonLabel = (count: number | null) => {
  if (count === null) return "Apply picks";
  if (count === 1) return "Apply 1 pick";
  return `Apply ${count} picks`;
};

export const teamShortName = (teams: TeamType[], teamId: number | null) => {
  if (teamId === null) return "";
  return teams.find((team) => team.id === String(teamId))?.shortName ?? "";
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

export const applyCompensationErrorMessages = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const messages = messagesFromBody(error.response.data);
    if (messages.length) return messages;
  }
  return [APPLY_COMPENSATION_SERVER_ERROR];
};

export const applyCompensationSuccessMessage = (data: unknown) => {
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    typeof data.success === "string" &&
    data.success.trim()
  ) {
    return data.success;
  }
  return APPLY_COMPENSATION_SUCCESS_FALLBACK;
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

export const clubBadgeClass = () =>
  "inline-grid h-[18px] min-w-[34px] shrink-0 place-items-center rounded bg-muted px-1 text-[9.5px] font-extrabold tracking-[0.3px] text-muted-foreground";

export const pickBoxClass = () =>
  "whitespace-nowrap rounded-md border border-border bg-muted px-[9px] py-[3px] text-[12.5px] font-bold tabular-nums text-foreground";
