"use client";

import { TeamType } from "@/app/api/type/common";
import {
  FormSelectField,
  SelectOption,
} from "@/components/common/fields/FormSelectField";
import { FormTextField } from "@/components/common/fields/FormTextfield";
import { UseFormReturn } from "react-hook-form";
import {
  AlignedFields,
  OverallPickField,
  ReferenceError,
} from "./PriorityPickFieldSections";
import { PriorityPickPreview } from "./PriorityPickPreview";
import { PriorityPickFormValues, PriorityPickStatusView } from "./type";
import { formGridClass, reasonClass } from "./util";

type PriorityPickFieldsProps = {
  form: UseFormReturn<PriorityPickFormValues>;
  isMobile: boolean;
  clubOptions: SelectOption[];
  pickTypeOptions: SelectOption[];
  alignedPickOptions: SelectOption[];
  clubsLoading: boolean;
  pickTypesLoading: boolean;
  picksLoading: boolean;
  showAlignedFields: boolean;
  showOverallPick: boolean;
  referenceError: string | null;
  status: PriorityPickStatusView;
  team: TeamType | null;
  draftYear: number | null;
};

export const PriorityPickFields = ({
  form,
  isMobile,
  clubOptions,
  pickTypeOptions,
  alignedPickOptions,
  clubsLoading,
  pickTypesLoading,
  picksLoading,
  showAlignedFields,
  showOverallPick,
  referenceError,
  status,
  team,
  draftYear,
}: PriorityPickFieldsProps) => {
  return (
    <div className="flex flex-col gap-3.5">
      <ReferenceError message={referenceError} />
      <div className={formGridClass(isMobile)}>
        <FormSelectField
          label="Club receiving the pick"
          control={form.control}
          name="club"
          options={clubOptions}
          isSearchable
          searchPlaceholder="Search clubs"
          placeholder={clubsLoading ? "Loading clubs…" : "Choose a club"}
          emptyMessage="No clubs found."
          disabled={clubsLoading}
          required
        />
        <FormSelectField
          label="Pick type"
          control={form.control}
          name="pickType"
          options={pickTypeOptions}
          placeholder={
            pickTypesLoading ? "Loading pick types…" : "Choose a pick type"
          }
          emptyMessage="No pick types found."
          disabled={pickTypesLoading}
          required
        />
        <AlignedFields
          show={showAlignedFields}
          form={form}
          alignedPickOptions={alignedPickOptions}
          picksLoading={picksLoading}
        />
        <OverallPickField show={showOverallPick} form={form} />
        <FormTextField
          label="Reason"
          control={form.control}
          name="reason"
          required
          className={reasonClass(isMobile)}
        />
      </div>
      <PriorityPickPreview
        status={status}
        team={team}
        draftYear={draftYear}
        isMobile={isMobile}
      />
    </div>
  );
};
