import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { useManualPickEditModal } from "./hook";
import { MANUAL_PICK_EDIT_REASON_OPTIONS } from "./util";

type ManualPickEditFieldsProps = {
  form: ReturnType<typeof useManualPickEditModal>["form"];
  pickOptions: ReturnType<typeof useManualPickEditModal>["pickOptions"];
  teamOptions: ReturnType<typeof useManualPickEditModal>["teamOptions"];
  picksLoading: boolean;
  teamsLoading: boolean;
  sameOwnerError: boolean;
};

export const ManualPickEditFields = ({
  form,
  pickOptions,
  teamOptions,
  picksLoading,
  teamsLoading,
  sameOwnerError,
}: ManualPickEditFieldsProps) => {
  return (
    <div className="flex flex-col">
      <FormSelectField
        label="Select pick to edit owner"
        control={form.control}
        name="pickId"
        options={pickOptions}
        isSearchable
        placeholder={picksLoading ? "Loading picks…" : "Select a pick"}
        emptyMessage="No picks found."
        disabled={picksLoading}
        required
      />

      <FormSelectField
        label="New owner of pick"
        control={form.control}
        name="newOwnerId"
        options={teamOptions}
        isSearchable
        placeholder={teamsLoading ? "Loading clubs…" : "Select a club"}
        emptyMessage="No clubs found."
        disabled={teamsLoading}
        required
      />

      {sameOwnerError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          New owner must be different from the pick&apos;s current owner.
        </div>
      )}

      <FormSelectField
        label="Most recent pick owner"
        control={form.control}
        name="viaOwnerId"
        options={teamOptions}
        isSearchable
        placeholder={teamsLoading ? "Loading clubs…" : "Select a club"}
        emptyMessage="No clubs found."
        disabled={teamsLoading}
      />

      <FormSelectField
        label="Reason for pick edit"
        control={form.control}
        name="reason"
        options={MANUAL_PICK_EDIT_REASON_OPTIONS}
        placeholder="Select a reason"
        required
      />
    </div>
  );
};
