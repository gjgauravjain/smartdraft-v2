import { FormRadioGroup } from "@/components/common/fields/FormRadioGroup";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { FormTextArea } from "@/components/common/fields/FormTextArea";
import { useInsertPickModal } from "./hook";
import { getInsertPickPlaceholder, INSERT_PICK_POSITION_OPTIONS } from "./util";

type InsertPickFieldsProps = {
  form: ReturnType<typeof useInsertPickModal>["form"];
  pickOptions: ReturnType<typeof useInsertPickModal>["pickOptions"];
  teamOptions: ReturnType<typeof useInsertPickModal>["teamOptions"];
  picksLoading: boolean;
  teamsLoading: boolean;
};

export const InsertPickFields = ({
  form,
  pickOptions,
  teamOptions,
  picksLoading,
  teamsLoading,
}: InsertPickFieldsProps) => {
  return (
    <div className="flex flex-col gap-1">
      <FormSelectField
        label="Club"
        control={form.control}
        name="teamId"
        options={teamOptions}
        isSearchable
        placeholder={getInsertPickPlaceholder(teamsLoading, "Select a club")}
        emptyMessage="No clubs found."
        disabled={teamsLoading}
        required
      />

      <FormSelectField
        label="Aligned pick"
        control={form.control}
        name="alignedPick"
        options={pickOptions}
        isSearchable
        placeholder={getInsertPickPlaceholder(
          picksLoading,
          "Select a pick to insert next to",
        )}
        emptyMessage="No picks found."
        disabled={picksLoading}
        required
      />

      <FormRadioGroup
        label="Position"
        control={form.control}
        name="position"
        options={INSERT_PICK_POSITION_OPTIONS}
        required
      />

      <FormTextArea
        label="Reason"
        control={form.control}
        name="reason"
        placeholder="Enter a reason for this insert"
        required
      />
    </div>
  );
};
