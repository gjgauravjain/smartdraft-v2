"use client";

import {
  FormSelectField,
  SelectOption,
} from "@/components/common/fields/FormSelectField";
import { FormTextField } from "@/components/common/fields/FormTextfield";
import { UseFormReturn } from "react-hook-form";
import { InsertControl } from "./InsertControl";
import { PriorityPickFormValues } from "./type";

export const ReferenceError = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-destructive">
      {message}
    </div>
  );
};

export const AlignedFields = ({
  show,
  form,
  alignedPickOptions,
  picksLoading,
}: {
  show: boolean;
  form: UseFormReturn<PriorityPickFormValues>;
  alignedPickOptions: SelectOption[];
  picksLoading: boolean;
}) => {
  if (!show) return null;

  return (
    <>
      <FormSelectField
        label="Aligned to pick"
        control={form.control}
        name="alignedPick"
        options={alignedPickOptions}
        isSearchable
        searchPlaceholder="Search picks"
        placeholder={picksLoading ? "Loading picks…" : "Search picks"}
        emptyMessage="No picks found."
        disabled={picksLoading}
        required
      />
      <InsertControl control={form.control} />
    </>
  );
};

export const OverallPickField = ({
  show,
  form,
}: {
  show: boolean;
  form: UseFormReturn<PriorityPickFormValues>;
}) => {
  if (!show) return null;

  return (
    <FormTextField
      label="Overall pick number"
      control={form.control}
      name="overallPick"
      type="number"
      min={1}
      step={1}
      inputMode="numeric"
      placeholder="e.g. 5"
      required
    />
  );
};
