"use client";

import { TeamType } from "@/app/api/type/common";
import { PlayerLookupType } from "@/app/api/type/player";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FreeAgentCompensationFormValues } from "./type";
import { buildPlayerOptions } from "./util";

type FreeAgentPlayerFieldProps = {
  players: PlayerLookupType[];
  teams: TeamType[];
  loading: boolean;
  className?: string;
};

export const FreeAgentPlayerField = ({
  players,
  teams,
  loading,
  className,
}: FreeAgentPlayerFieldProps) => {
  const { control } = useFormContext<FreeAgentCompensationFormValues>();

  const playerOptions = useMemo(
    () => buildPlayerOptions(players, teams),
    [players, teams],
  );

  return (
    <FormSelectField
      label="Free agent"
      control={control}
      name="playerId"
      options={playerOptions}
      isSearchable
      searchPlaceholder="Search players"
      placeholder={loading ? "Loading players…" : "Choose a player"}
      emptyMessage="No players found."
      disabled={loading}
      required
      className={className}
    />
  );
};
