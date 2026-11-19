"use client";

import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { BidMatchFieldsProps } from "./type";

export const BidMatchFields = ({
  control,
  clubLabel,
  clubOptions,
  playerOptions,
  pickOptions,
  clubsLoading,
  playersLoading,
  picksLoading,
}: BidMatchFieldsProps) => {
  return (
    <div className="grid gap-3 grid-cols-3">
      <FormSelectField
        control={control}
        name="teamId"
        label={clubLabel}
        options={clubOptions}
        placeholder={clubsLoading ? "Loading clubs…" : "Choose a club"}
        isSearchable
        searchPlaceholder="Search clubs"
        required
      />
      <FormSelectField
        control={control}
        name="playerId"
        label="Player"
        options={playerOptions}
        placeholder={playersLoading ? "Loading players…" : "Choose a player"}
        emptyMessage="No players"
        isSearchable
        searchPlaceholder="Search players"
        required
      />
      <FormSelectField
        control={control}
        name="pickId"
        label="Bid pick"
        options={pickOptions}
        placeholder={picksLoading ? "Loading picks…" : "Choose the bid pick"}
        emptyMessage="No picks"
        isSearchable
        searchPlaceholder="Search picks"
        required
      />
    </div>
  );
};
