"use client";

import { TeamType } from "@/app/api/type/common";
import { PlayerLookupType } from "@/app/api/type/player";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { FormTextField } from "@/components/common/fields/FormTextfield";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { UseFormReturn } from "react-hook-form";
import { FreeAgentPlayerField } from "./FreeAgentPlayerField";
import { InsertControl } from "./InsertControl";
import { FreeAgentCompensationPreview } from "./FreeAgentCompensationPreview";
import {
  FreeAgentCompensationFormValues,
  FreeAgentCompensationStatusView,
} from "./type";
import { formGridClass, fullWidthFieldClass } from "./util";

type FreeAgentCompensationFieldsProps = {
  form: UseFormReturn<FreeAgentCompensationFormValues>;
  isMobile: boolean;
  clubOptions: SelectOption[];
  pickTypeOptions: SelectOption[];
  alignedPickOptions: SelectOption[];
  players: PlayerLookupType[];
  teams: TeamType[];
  clubsLoading: boolean;
  pickTypesLoading: boolean;
  picksLoading: boolean;
  playersLoading: boolean;
  showAlignedFields: boolean;
  showOverallPick: boolean;
  referenceError: string | null;
  status: FreeAgentCompensationStatusView;
  team: TeamType | null;
  draftYear: number | null;
};

export const FreeAgentCompensationFields = ({
  form,
  isMobile,
  clubOptions,
  pickTypeOptions,
  alignedPickOptions,
  players,
  teams,
  clubsLoading,
  pickTypesLoading,
  picksLoading,
  playersLoading,
  showAlignedFields,
  showOverallPick,
  referenceError,
  status,
  team,
  draftYear,
}: FreeAgentCompensationFieldsProps) => {
  return (
    <div className="flex flex-col gap-3.5">
      <div className={formGridClass(isMobile)}>
        <FormSelectField
          label="Club receiving the pick"
          control={form.control}
          name="club"
          options={clubOptions}
          isSearchable
          required
          disabled={clubsLoading}
          placeholder={clubsLoading ? "Loading clubs…" : "Select a club"}
          emptyMessage="No clubs found."
        />
        <FormSelectField
          label="Pick type"
          control={form.control}
          name="pickType"
          options={pickTypeOptions}
          required
          disabled={pickTypesLoading}
          placeholder={
            pickTypesLoading ? "Loading pick types…" : "Select a pick type"
          }
          emptyMessage="No pick types found."
        />
        <AlignedFields
          show={showAlignedFields}
          form={form}
          options={alignedPickOptions}
          loading={picksLoading}
        />
        <OverallPickField show={showOverallPick} form={form} />
        <FreeAgentPlayerField
          players={players}
          teams={teams}
          loading={playersLoading}
          className={fullWidthFieldClass(isMobile)}
        />
      </div>
      <ReferenceError message={referenceError} />
      <FreeAgentCompensationPreview
        status={status}
        team={team}
        draftYear={draftYear}
        isMobile={isMobile}
      />
    </div>
  );
};

const AlignedFields = ({
  show,
  form,
  options,
  loading,
}: {
  show: boolean;
  form: UseFormReturn<FreeAgentCompensationFormValues>;
  options: SelectOption[];
  loading: boolean;
}) => {
  if (!show) return null;

  return (
    <>
      <FormSelectField
        label="Aligned to pick"
        control={form.control}
        name="alignedPick"
        options={options}
        isSearchable
        required
        disabled={loading}
        placeholder={loading ? "Loading picks…" : "Select a pick"}
        emptyMessage="No unused picks found."
      />
      <InsertControl control={form.control} />
    </>
  );
};

const OverallPickField = ({
  show,
  form,
}: {
  show: boolean;
  form: UseFormReturn<FreeAgentCompensationFormValues>;
}) => {
  if (!show) return null;

  return (
    <FormTextField
      label="Overall pick number"
      control={form.control}
      name="overallPick"
      required
      type="number"
      min={1}
      step={1}
      inputMode="numeric"
      placeholder="e.g. 5"
    />
  );
};

const ReferenceError = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return <p className="text-[13px] text-destructive">{message}</p>;
};
