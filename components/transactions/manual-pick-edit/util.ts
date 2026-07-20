import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { z } from "zod";
import { ManualPickEditFormValues } from "./type";

export const MANUAL_PICK_EDIT_DEFAULT_VALUES: ManualPickEditFormValues = {
  pickId: "",
  newOwnerId: "",
  viaOwnerId: "",
  reason: "",
};

export const MANUAL_PICK_EDIT_REASON_OPTIONS: SelectOption[] = [
  { label: "Carry Over Trade", value: "Carry Over Trade" },
  { label: "Other", value: "Other" },
];

export const buildManualPickEditPickOptions = (
  picks: DraftPicksDataType[],
): SelectOption[] =>
  picks
    .filter((pick) => pick.pickStatus !== "Used")
    .map((pick) => ({
      value: String(pick.value),
      label: pick.label,
    }));

export const buildTeamOptions = (teams: TeamType[]): SelectOption[] =>
  teams.map((team) => ({
    value: String(team.id),
    label: team.teamNames,
    icon: team.image,
  }));

export const manualPickEditFormSchema = z.object({
  pickId: z.string().min(1, "Please select a pick"),
  newOwnerId: z.string().min(1, "Please select a new owner"),
  viaOwnerId: z.string(),
  reason: z.string().min(1, "Please select a reason"),
});
