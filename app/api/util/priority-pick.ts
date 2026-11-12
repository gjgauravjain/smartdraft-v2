import { DraftPicksDataType } from "../type/draftpicks";
import {
  PriorityPickFieldErrors,
  PriorityPickFieldName,
  PriorityPickFormInput,
  PriorityPickHandPick,
  PriorityPickImpact,
  PriorityPickInsert,
  PriorityPickPreviewResult,
  PriorityPickRequest,
} from "../type/priority-pick";
import axios from "axios";

export const FIXED_OVERALL_PICK_TYPE = "Fixed Overall Pick";
export const PRIORITY_PICK_SERVER_ERROR =
  "Something went wrong. Check the details and try again.";
export const PRIORITY_PICK_SUCCESS_FALLBACK =
  "Priority Pick Added Successfully";

const API_FIELD_TO_FORM: Record<string, PriorityPickFieldName> = {
  teamid: "club",
  pick_type: "pickType",
  ppid: "alignedPick",
  unique_pick: "alignedPick",
  pp_insert_instructions: "insert",
  overall_pick: "overallPick",
  reason: "reason",
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

export const isPriorityPickInsert = (
  value: string,
): value is PriorityPickInsert => value === "Before" || value === "After";

export const isPriorityPickFormReady = (values: PriorityPickFormInput) => {
  if (!values.club || !values.pickType || !values.reason.trim()) return false;
  if (needsAlignedPickFields(values.pickType)) {
    if (!values.alignedPick || !isPriorityPickInsert(values.insert)) {
      return false;
    }
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
  values: PriorityPickFormInput,
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

export const buildPriorityPickRequest = ({
  values,
  picks,
  projectId,
  projectYear,
}: {
  values: PriorityPickFormInput;
  picks: DraftPicksDataType[];
  projectId: number;
  projectYear: number | null;
}): PriorityPickRequest | null => {
  if (!isPriorityPickFormReady(values)) return null;

  const aligned = resolveAlignedPick(values, picks, projectYear);
  if (!aligned) return null;

  const insert = needsAlignedPickFields(values.pickType)
    ? values.insert
    : "After";
  if (!isPriorityPickInsert(insert)) return null;

  const request: PriorityPickRequest = {
    projectId,
    teamid: values.club,
    pick_type: values.pickType,
    ppid: String(aligned.value),
    unique_pick: aligned.unique,
    pp_insert_instructions: insert,
    reason: values.reason.trim(),
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

const toHandPicks = (value: unknown): PriorityPickHandPick[] => {
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

export const transformPriorityPickImpact = (
  data: unknown,
): PriorityPickImpact => {
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

export const transformPriorityPickTypes = (
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

export const parsePriorityPickErrorBody = (
  data: unknown,
): { messages: string[]; fieldErrors: PriorityPickFieldErrors } | null => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const messages: string[] = [];
  const fieldErrors: PriorityPickFieldErrors = {};

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

export const previewErrorFromUnknown = (
  error: unknown,
): Exclude<PriorityPickPreviewResult, { kind: "success" }> => {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const parsed = parsePriorityPickErrorBody(error.response.data);
    if (parsed) {
      return { kind: "field", ...parsed };
    }
  }

  return { kind: "server", message: PRIORITY_PICK_SERVER_ERROR };
};

export const priorityPickSuccessMessage = (data: unknown) => {
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    typeof data.success === "string" &&
    data.success.trim()
  ) {
    return data.success;
  }
  return PRIORITY_PICK_SUCCESS_FALLBACK;
};
