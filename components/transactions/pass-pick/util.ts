import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { PassPickPassType } from "@/app/api/type/pass-pick";
import { RadioOption } from "@/components/common/fields/FormRadioGroup";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { parseRound } from "../father-son/util";
import { z } from "zod";

export const PASS_PICK_DEFAULT_VALUES = {
  pickId: "",
  selectedPassPick: "ONE" as PassPickPassType,
};

export const PASS_PICK_RADIO_OPTIONS: RadioOption[] = [
  {
    label: "Pass this pick only",
    value: "ONE",
  },
  {
    label: "Pass this pick and all remaining picks",
    value: "ALL",
    variant: "warning",
    description:
      "Forfeits every remaining pick for this club. This cannot be undone.",
  },
];

export const buildPassPickOptions = ({
  picks,
  teamNamesById,
}: {
  picks: DraftPicksDataType[];
  teamNamesById: Map<string, string>;
}): SelectOption[] =>
  picks
    .filter((pick) => pick.pickStatus !== "Used")
    .map((pick) => {
      const owner = teamNamesById.get(String(pick.currentOwner));
      const round = parseRound(pick.label);

      return {
        value: String(pick.value),
        label: `${round ? `RD${round} · ` : ""}Pick ${pick.overallPick}${
          owner ? ` · ${owner}` : ""
        }`,
      };
    });

export const passPickFormSchema = z.object({
  pickId: z.string().min(1, "Please select a pick"),
  selectedPassPick: z.enum(["ONE", "ALL"]),
});
