import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { PriorityPickHandPick } from "@/app/api/type/priority-pick";
import {
  isFixedOverallPickType,
  isPriorityPickFormReady,
  needsAlignedPickFields,
} from "@/app/api/util/priority-pick";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { z } from "zod";
import { PriorityPickFormValues } from "./type";

export const PRIORITY_PICK_DEFAULT_VALUES: PriorityPickFormValues = {
  club: "",
  pickType: "",
  alignedPick: "",
  insert: "",
  overallPick: "",
  reason: "",
};

export const PRIORITY_PICK_IDLE =
  "Pick a club, pick type and reason to see the impact.";

export const priorityPickFormSchema = z
  .object({
    club: z.string(),
    pickType: z.string(),
    alignedPick: z.string(),
    insert: z.string(),
    overallPick: z.string(),
    reason: z.string(),
  })
  .superRefine((values, ctx) => {
    if (isPriorityPickFormReady(values)) return;
    ctx.addIssue({
      code: "custom",
      message: "Complete every shown field to preview the priority pick.",
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

export const clearHiddenPriorityPickFields = (
  pickType: string,
  setValue: (name: keyof PriorityPickFormValues, value: string) => void,
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

export const chipGridClass = (isMobile: boolean) => {
  if (isMobile) return "grid grid-cols-5 gap-1";
  return "grid grid-cols-8 gap-1";
};

export const chipClass = (pick: PriorityPickHandPick, future: boolean) => {
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

export const formGridClass = (isMobile: boolean) => {
  if (isMobile) return "grid grid-cols-1 gap-3";
  return "grid grid-cols-2 gap-3";
};

export const reasonClass = (isMobile: boolean) => {
  if (isMobile) return undefined;
  return "col-span-2";
};

export const actionClass = (isMobile: boolean) => {
  if (isMobile) return "h-12 flex-1 rounded-[9px] text-[15px] font-semibold";
  return undefined;
};
