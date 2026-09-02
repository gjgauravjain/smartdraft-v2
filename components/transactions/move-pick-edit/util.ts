import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { MovePickPosition } from "@/app/api/type/move-pick";
import { RadioOption } from "@/components/common/fields/FormRadioGroup";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { z } from "zod";
import { MovePickFormValues } from "./type";

export const MOVE_PICK_DEFAULT_VALUES: MovePickFormValues = {
  pick: "",
  destinationPick: "",
  position: "",
  reason: "",
};

export const MOVE_PICK_POSITION_OPTIONS: RadioOption[] = [
  {
    label: "Before",
    value: "Before",
    description: "Place the pick immediately before the destination pick.",
  },
  {
    label: "After",
    value: "After",
    description: "Place the pick immediately after the destination pick.",
  },
];

export const buildMovePickOptions = (
  picks: DraftPicksDataType[],
  excludeUnique?: string,
): SelectOption[] =>
  picks
    .filter((pick) => {
      if (!pick.unique) return false;
      if (excludeUnique && pick.unique === excludeUnique) return false;
      return true;
    })
    .map((pick) => ({
      value: pick.unique,
      label: pick.label || pick.display,
    }));

export const getMovePickPlaceholder = (
  isLoading: boolean,
  emptyLabel: string,
) => {
  if (isLoading) return "Loading picks…";
  return emptyLabel;
};

export const movePickFormSchema = z
  .object({
    pick: z.string().min(1, "Please select a pick to move"),
    destinationPick: z.string().min(1, "Please select a destination pick"),
    position: z.string().min(1, "Please select a position"),
    reason: z.string().trim().min(1, "Please enter a reason"),
  })
  .refine((values) => values.pick !== values.destinationPick, {
    message: "Pick to move and destination pick must be different",
    path: ["destinationPick"],
  });

export const isMovePickPosition = (value: string): value is MovePickPosition =>
  value === "Before" || value === "After";

export const canSubmitMovePick = ({
  pick,
  destinationPick,
  position,
  reason,
}: MovePickFormValues) => {
  if (!pick || !destinationPick) return false;
  if (pick === destinationPick) return false;
  if (!isMovePickPosition(position)) return false;
  if (!reason.trim()) return false;
  return true;
};
