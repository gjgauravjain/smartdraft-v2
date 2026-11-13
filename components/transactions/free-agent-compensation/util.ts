import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { PlayerLookupType } from "@/app/api/type/player";
import { FreeAgentHandPick } from "@/app/api/type/free-agent-compensation";
import {
  isFixedOverallPickType,
  isFreeAgentCompensationReady,
  needsAlignedPickFields,
} from "@/app/api/util/free-agent-compensation";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { z } from "zod";
import { FreeAgentCompensationFormValues } from "./type";

export const FREE_AGENT_DEFAULT_VALUES: FreeAgentCompensationFormValues = {
  club: "",
  pickType: "",
  alignedPick: "",
  insert: "",
  overallPick: "",
  playerId: "",
  playerQuery: "",
};

export const FREE_AGENT_IDLE =
  "Pick a club, pick type and the free agent to see the impact.";

export const freeAgentCompensationFormSchema = z
  .object({
    club: z.string(),
    pickType: z.string(),
    alignedPick: z.string(),
    insert: z.string(),
    overallPick: z.string(),
    playerId: z.string(),
    playerQuery: z.string(),
  })
  .superRefine((values, ctx) => {
    if (isFreeAgentCompensationReady(values)) return;
    ctx.addIssue({
      code: "custom",
      message: "Complete every shown field to preview the compensation pick.",
    });
  });

export const buildClubOptions = (teams: TeamType[]): SelectOption[] =>
  teams.map((team) => ({
    value: team.id,
    label: team.teamNames,
    icon: team.image,
  }));

export const buildPickTypeOptions = (
  pickTypes: { value: string; label: string }[],
): SelectOption[] => pickTypes;

export const buildPlayerOptions = (
  players: PlayerLookupType[],
  teams: TeamType[],
): SelectOption[] =>
  players.map((player) => {
    const team = player.teamId
      ? teams.find((item) => item.id === player.teamId)
      : null;
    const label = team ? `${player.name} (${team.shortName})` : player.name;
    return {
      value: player.playerId,
      label,
    };
  });

export const buildAlignedPickOptions = (
  picks: DraftPicksDataType[],
  projectYear: number | null,
): SelectOption[] => {
  const available = picks
    .filter((pick) => pick.pickStatus !== "Used")
    .sort((left, right) => {
      const leftIsDraftYear = projectYear !== null && left.year === projectYear;
      const rightIsDraftYear =
        projectYear !== null && right.year === projectYear;
      if (leftIsDraftYear !== rightIsDraftYear) {
        return leftIsDraftYear ? -1 : 1;
      }
      if (left.year !== right.year) return left.year - right.year;
      return left.overallPick - right.overallPick;
    });

  return available.map((pick) => ({
    value: String(pick.value),
    label: pick.label,
    group: String(pick.year),
  }));
};

export const clearHiddenFreeAgentFields = (
  pickType: string,
  setValue: (
    name: keyof FreeAgentCompensationFormValues,
    value: string,
  ) => void,
) => {
  if (!needsAlignedPickFields(pickType)) {
    setValue("alignedPick", "");
    setValue("insert", "");
  }
  if (!isFixedOverallPickType(pickType)) {
    setValue("overallPick", "");
  }
};

export const formatDraftPoints = (value: number) =>
  value.toLocaleString("en-AU");

export const formatImpactChange = (value: number) => {
  const formatted = formatDraftPoints(value);
  if (value > 0) return `+${formatted}`;
  return formatted;
};

export const yearLabel = (draftYear: number | null, offset: number) => {
  if (draftYear === null) return "";
  return String(draftYear + offset);
};

export const formGridClass = (isMobile: boolean) => {
  if (isMobile) return "grid grid-cols-1 gap-3";
  return "grid grid-cols-2 gap-3";
};

export const fullWidthFieldClass = (isMobile: boolean) => {
  if (isMobile) return undefined;
  return "col-span-2";
};

export const actionBarClass = (isMobile: boolean) => {
  if (isMobile) {
    return "flex shrink-0 gap-2 border-t border-border bg-card px-4 pb-[26px] pt-3";
  }
  return "flex shrink-0 justify-end gap-2 border-t border-border bg-card px-5 py-3";
};

export const actionButtonClass = (isMobile: boolean) => {
  if (isMobile) return "h-12 flex-1 rounded-[9px] text-[15px] font-semibold";
  return undefined;
};

export const chipGridClass = (isMobile: boolean) => {
  if (isMobile) return "col-span-2 grid grid-cols-5 gap-1";
  return "col-span-2 grid grid-cols-8 gap-1";
};

export const pickChipClass = (pick: FreeAgentHandPick, future: boolean) => {
  if (pick.isNew) {
    return "border-primary bg-primary-light font-semibold text-foreground";
  }
  if (pick.pickStatus === "Used") {
    return "border-transparent bg-transparent font-medium text-muted-foreground line-through";
  }
  if (future) {
    return "border-dashed border-border bg-card font-medium text-muted-foreground";
  }
  return "border-solid border-border bg-card font-medium text-muted-foreground";
};
