import { FormRadioGroup } from "@/components/common/fields/FormRadioGroup";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { useMovePickModal } from "./hook";
import { getMovePickPlaceholder, MOVE_PICK_POSITION_OPTIONS } from "./util";
import { FormTextArea } from "@/components/common/fields/FormTextArea";

type MovePickFieldsProps = {
  form: ReturnType<typeof useMovePickModal>["form"];
  pickOptions: ReturnType<typeof useMovePickModal>["pickOptions"];
  destinationOptions: ReturnType<typeof useMovePickModal>["destinationOptions"];
  picksLoading: boolean;
  samePickError: boolean;
};

export const MovePickFields = ({
  form,
  pickOptions,
  destinationOptions,
  picksLoading,
  samePickError,
}: MovePickFieldsProps) => {
  return (
    <div className="flex flex-col gap-1">
      <FormSelectField
        label="Pick to move"
        control={form.control}
        name="pick"
        options={pickOptions}
        isSearchable
        placeholder={getMovePickPlaceholder(
          picksLoading,
          "Select a pick to move",
        )}
        emptyMessage="No picks found."
        disabled={picksLoading}
        required
      />

      <FormSelectField
        label="Destination pick"
        control={form.control}
        name="destinationPick"
        options={destinationOptions}
        isSearchable
        placeholder={getMovePickPlaceholder(
          picksLoading,
          "Select a destination pick",
        )}
        emptyMessage="No picks found."
        disabled={picksLoading}
        required
      />

      {samePickError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          Pick to move and destination pick must be different.
        </div>
      )}

      <FormRadioGroup
        label="Position"
        control={form.control}
        name="position"
        options={MOVE_PICK_POSITION_OPTIONS}
        required
      />

      <FormTextArea
        label="Reason"
        control={form.control}
        name="reason"
        placeholder="Enter a reason for this move"
        required
      />
    </div>
  );
};
