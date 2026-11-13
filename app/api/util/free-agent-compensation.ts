import axios from "axios";
import { DraftPicksDataType } from "../type/draftpicks";
import { PlayerLookupType } from "../type/player";
import {
  FreeAgentCompensationFieldErrors,
  FreeAgentCompensationFieldName,
  FreeAgentCompensationFormInput,
  FreeAgentCompensationImpact,
  FreeAgentCompensationInsert,
  FreeAgentCompensationPreviewResult,
  FreeAgentCompensationRequest,
  FreeAgentHandPick,
} from "../type/free-agent-compensation";

export const FIXED_OVERALL_PICK_TYPE = "Fixed Overall Pick";
export const FREE_AGENT_SERVER_ERROR =
  "Something went wrong. Check the details and try again.";
export const FREE_AGENT_SUCCESS_FALLBACK =
  "Free Agent Compensation Added Successfully";

const API_FIELD_TO_FORM: Record<string, FreeAgentCompensationFieldName> = {
  teamid: "club",
  pick_type: "pickType",
  pick_id: "alignedPick",
  unique_pick: "alignedPick",
  instructions: "insert",
  overall_pick: "overallPick",
  reason: "playerId",
  player_id: "playerId",
};

export const isFixedOverallPickType = (pickType?: string) =>
  pickType === FIXED_OVERALL_PICK_TYPE;

export const needsAlignedPickFields = (pickType?: string) => {
  if (!pickType) return false;
  if (isFixedOverallPickType(pickType)) return false;
  if (pickType.startsWith("Start of") || pickType.startsWith("End of")) {
    return false;
  }
  return true;
};

export const isValidOverallPickNumber = (overallPick?: string) =>
  !!overallPick && /^\d+$/.test(overallPick) && Number(overallPick) >= 1;

export const isFreeAgentInsert = (
  value: string,
): value is FreeAgentCompensationInsert =>
  value === "Before" || value === "After";

export const isFreeAgentCompensationReady = (
  values: FreeAgentCompensationFormInput,
) => {
  if (!values.club || !values.pickType || !values.playerId) return false;
  if (needsAlignedPickFields(values.pickType)) {
    if (!values.alignedPick || !isFreeAgentInsert(values.insert)) return false;
  }
  if (
    isFixedOverallPickType(values.pickType) &&
    !isValidOverallPickNumber(values.overallPick)
  ) {
    return false;
  }
  return true;
};

export const resolveAlignedPick = (
  values: FreeAgentCompensationFormInput,
  picks: DraftPicksDataType[],
  projectYear: number | null,
) => {
  const available = picks.filter((pick) => pick.pickStatus !== "Used");

  if (needsAlignedPickFields(values.pickType)) {
    return (
      available.find((pick) => String(pick.value) === values.alignedPick) ??
      null
    );
  }

  if (projectYear === null) return null;

  const yearPicks = available.filter((pick) => pick.year === projectYear);
  if (!yearPicks.length) return null;

  return yearPicks.reduce((lowest, pick) =>
    pick.overallPick < lowest.overallPick ? pick : lowest,
  );
};

const toPlayerId = (playerId: string): number | string => {
  if (/^\d+$/.test(playerId)) return Number(playerId);
  return playerId;
};

export const buildFreeAgentCompensationRequest = ({
  values,
  picks,
  players,
  projectYear,
}: {
  values: FreeAgentCompensationFormInput;
  picks: DraftPicksDataType[];
  players: PlayerLookupType[];
  projectYear: number | null;
}): FreeAgentCompensationRequest | null => {
  if (!isFreeAgentCompensationReady(values)) return null;

  const player = players.find((item) => item.playerId === values.playerId);
  const aligned = resolveAlignedPick(values, picks, projectYear);
  if (!player || !aligned) return null;

  const insert = needsAlignedPickFields(values.pickType)
    ? values.insert
    : "After";
  if (!isFreeAgentInsert(insert)) return null;

  const request: FreeAgentCompensationRequest = {
    teamid: values.club,
    pick_type: values.pickType,
    pick_id: String(aligned.value),
    unique_pick: aligned.unique,
    instructions: insert,
    reason: player.name,
    player_id: toPlayerId(player.playerId),
  };

  if (isFixedOverallPickType(values.pickType)) {
    request.overall_pick = Number(values.overallPick);
  }

  return request;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const toHandPicks = (value: unknown): FreeAgentHandPick[] => {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const row =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};
    const pick = row.pick;
    const pickValue =
      typeof pick === "number" || typeof pick === "string" ? pick : "";

    return {
      pick: pickValue,
      pickStatus: typeof row.pick_status === "string" ? row.pick_status : "",
      pickName: typeof row.pick_name === "string" ? row.pick_name : "",
      isNew: row.is_new === true,
    };
  });
};

export const transformFreeAgentCompensationImpact = (
  data: unknown,
): FreeAgentCompensationImpact => {
  const body =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  return {
    impactDescription:
      typeof body.impact_description === "string"
        ? body.impact_description
        : "",
    teamDraftPointsStart: toNumber(body.team_draft_points_start),
    teamDraftPointsEnd: toNumber(body.team_draft_points_end),
    teamDraftPointsImpact: toNumber(body.team_draft_points_impact),
    currentYearPicks: toHandPicks(body.current_year_picks_dict),
    nextYearPicks: toHandPicks(body.next_year_picks_dict),
    currentYearPicksPts: toNumber(body.current_year_picks_pts),
    nextYearPicksPts: toNumber(body.next_year_picks_pts),
  };
};

export const transformFreeAgentPickTypes = (
  data: unknown,
): { value: string; label: string }[] => {
  if (!Array.isArray(data)) return [];

  return data.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const displayName = (item as { display_name?: unknown }).display_name;
    if (typeof displayName !== "string" || !displayName) return [];
    return [{ value: displayName, label: displayName }];
  });
};

const messageFromValue = (value: unknown) => {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  return value
    .filter((item): item is string => typeof item === "string")
    .join(" ")
    .trim();
};

export const parseFreeAgentErrorBody = (
  data: unknown,
): { messages: string[]; fieldErrors: FreeAgentCompensationFieldErrors } | null => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const messages: string[] = [];
  const fieldErrors: FreeAgentCompensationFieldErrors = {};

  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    const message = messageFromValue(value);
    if (!message) return;
    messages.push(message);
    const field = API_FIELD_TO_FORM[key];
    if (!field) return;
    fieldErrors[field] = fieldErrors[field]
      ? `${fieldErrors[field]} ${message}`
      : message;
  });

  if (!messages.length) return null;
  return { messages, fieldErrors };
};

const messageFrom404 = (data: unknown) => {
  if (!data || typeof data !== "object" || !("message" in data)) return "";
  const message = (data as { message?: unknown }).message;
  if (typeof message !== "string") return "";
  return message.trim();
};

export const previewErrorFromUnknown = (
  error: unknown,
): Exclude<FreeAgentCompensationPreviewResult, { kind: "success" }> => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      const parsed = parseFreeAgentErrorBody(error.response.data);
      if (parsed) return { kind: "field", ...parsed };
    }
    if (error.response?.status === 404) {
      const message = messageFrom404(error.response.data);
      if (message) return { kind: "server", message };
    }
  }

  return { kind: "server", message: FREE_AGENT_SERVER_ERROR };
};

export const freeAgentSuccessMessage = (data: unknown) => {
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    typeof data.success === "string" &&
    data.success.trim()
  ) {
    return data.success;
  }
  return FREE_AGENT_SUCCESS_FALLBACK;
};
