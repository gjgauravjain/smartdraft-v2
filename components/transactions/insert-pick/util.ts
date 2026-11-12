import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { InsertPickPosition } from "@/app/api/type/insert-pick";
import { RadioOption } from "@/components/common/fields/FormRadioGroup";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { z } from "zod";
import { InsertPickFormValues } from "./type";

export const INSERT_PICK_DEFAULT_VALUES: InsertPickFormValues = {
  teamId: "",
  alignedPick: "",
  position: "",
  reason: "",
};

export const INSERT_PICK_POSITION_OPTIONS: RadioOption[] = [
  {
    label: "Before",
    value: "Before",
    description: "Insert the new pick immediately before the aligned pick.",
  },
  {
    label: "After",
    value: "After",
    description: "Insert the new pick immediately after the aligned pick.",
  },
];

export const buildInsertPickTeamOptions = (teams: TeamType[]): SelectOption[] =>
  teams.map((team) => ({
    value: String(team.id),
    label: team.teamNames,
    icon: team.image,
  }));

export const buildInsertPickOptions = (
  picks: DraftPicksDataType[],
): SelectOption[] =>
  picks
    .filter((pick) => Boolean(pick.unique))
    .map((pick) => ({
      value: pick.unique,
      label: pick.label || pick.display,
    }));

export const getInsertPickPlaceholder = (
  isLoading: boolean,
  emptyLabel: string,
) => {
  if (isLoading) return "Loading…";
  return emptyLabel;
};

export const insertPickFormSchema = z.object({
  teamId: z.string().min(1, "Please select a club"),
  alignedPick: z.string().min(1, "Please select an aligned pick"),
  position: z.string().min(1, "Please select a position"),
  reason: z.string().trim().min(1, "Please enter a reason"),
});

export const isInsertPickPosition = (
  value: string,
): value is InsertPickPosition => value === "Before" || value === "After";

export const canSubmitInsertPick = ({
  teamId,
  alignedPick,
  position,
  reason,
}: InsertPickFormValues) => {
  if (!teamId) return false;
  if (!alignedPick) return false;
  if (!isInsertPickPosition(position)) return false;
  if (!reason.trim()) return false;
  return true;
};
