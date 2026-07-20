import { FormRadioGroup } from "@/components/common/fields/FormRadioGroup";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { Loader2 } from "lucide-react";
import { usePassPickModal } from "./hook";
import { PassPickImpactPreview } from "./PassPickImpactPreview";
import { PASS_PICK_RADIO_OPTIONS } from "./util";

type PassPickFieldsProps = {
  form: ReturnType<typeof usePassPickModal>["form"];
  picksLoading: boolean;
  pickOptions: ReturnType<typeof usePassPickModal>["pickOptions"];
  selectedPassPick: ReturnType<typeof usePassPickModal>["selectedPassPick"];
  impactData: ReturnType<typeof usePassPickModal>["impactData"];
  impactLoading: boolean;
  impactError: string | null;
  readyToShowPreview: boolean;
};

export const PassPickFields = ({
  form,
  picksLoading,
  pickOptions,
  selectedPassPick,
  impactData,
  impactLoading,
  impactError,
  readyToShowPreview,
}: PassPickFieldsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <FormSelectField
        label="Select pick to pass"
        control={form.control}
        name="pickId"
        options={pickOptions}
        isSearchable
        placeholder={picksLoading ? "Loading picks…" : "Select a pick"}
        emptyMessage="No available picks found."
        disabled={picksLoading}
        required
      />

      <FormRadioGroup
        label="Pass scope"
        control={form.control}
        name="selectedPassPick"
        options={PASS_PICK_RADIO_OPTIONS}
      />

      {readyToShowPreview && impactLoading && (
        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Calculating impact…
        </div>
      )}

      {readyToShowPreview && impactError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {impactError}
        </div>
      )}

      {readyToShowPreview && impactData && !impactLoading && !impactError && (
        <PassPickImpactPreview
          impactData={impactData}
          showAllPicksWarning={selectedPassPick === "ALL"}
        />
      )}
    </div>
  );
};
