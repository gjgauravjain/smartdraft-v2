import {
  ApplyCompensationImpact,
  ApplyCompensationPick,
} from "../type/apply-compensation";

const textOrEmpty = (value: unknown) =>
  typeof value === "string" ? value : "";

const textOrNull = (value: unknown) => {
  if (typeof value !== "string") return null;
  if (!value.trim()) return null;
  return value;
};

const overallPickFrom = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
};

const teamIdFrom = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
};

const removedPicksFrom = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim() !== "",
  );
};

const transformPick = (item: unknown): ApplyCompensationPick | null => {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;

  return {
    teamId: teamIdFrom(row.team_id),
    teamName: textOrEmpty(row.team_name),
    label: textOrEmpty(row.compensation_pick_label),
    overallPick: overallPickFrom(row.overall_pick),
    slideSummary: textOrNull(row.slide_summary),
    removedPicks: removedPicksFrom(row.removed_picks),
  };
};

export const transformApplyCompensationImpact = (
  data: unknown,
): ApplyCompensationImpact => {
  const picks =
    data &&
    typeof data === "object" &&
    Array.isArray((data as { compensation_picks?: unknown }).compensation_picks)
      ? (data as { compensation_picks: unknown[] }).compensation_picks
      : [];

  return {
    picks: picks.flatMap((item) => {
      const pick = transformPick(item);
      return pick ? [pick] : [];
    }),
  };
};
