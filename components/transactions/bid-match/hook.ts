"use client";

import { useGetTeams } from "@/app/api/react-query/common";
import {
  useGetAllDraftPicksList,
  useGetScenarioPicksList,
} from "@/app/api/react-query/draftpicks";
import { useGetProjectPlayers } from "@/app/api/react-query/player";
import {
  useGetBidMatchImpact,
  useSubmitBidMatch,
} from "@/app/api/react-query/transactions";
import { BidMatchKind } from "@/app/api/type/transaction";
import { getErrorMessage } from "@/lib/api-client";
import { useStore } from "@/store/useStore";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { BidMatchFormValues } from "./type";
import {
  BID_MATCH_CONFIG,
  BID_MATCH_DEFAULTS,
  BID_MATCH_ERROR,
  buildBidMatchResult,
  pickOptionLabel,
} from "./util";

type UseBidMatchModalArgs = {
  isOpen: boolean;
  onClose: () => void;
  bidType: BidMatchKind;
  scenarioId?: string;
  transactionNo?: string;
};

export const useBidMatchModal = ({
  isOpen,
  onClose,
  bidType,
  scenarioId,
  transactionNo,
}: UseBidMatchModalArgs) => {
  const config = BID_MATCH_CONFIG[bidType];
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");
  const hasProject = Number.isInteger(projectId) && projectId > 0;
  const parsedYear = Number(selectedProject?.year);
  const projectYear =
    Number.isInteger(parsedYear) && parsedYear >= 1900 ? parsedYear : null;
  const scenarioOpen = Boolean(scenarioId && transactionNo);
  const scenarioForBid = bidType === "nga" ? undefined : scenarioId;
  const transactionForBid = bidType === "nga" ? undefined : transactionNo;

  const form = useForm<BidMatchFormValues>({
    defaultValues: BID_MATCH_DEFAULTS,
  });
  const [teamId = "", playerId = "", pickId = ""] = useWatch({
    control: form.control,
    name: ["teamId", "playerId", "pickId"],
  });

  const teamsQuery = useGetTeams();
  const playersQuery = useGetProjectPlayers({
    projectId,
    enabled: isOpen && hasProject,
  });
  const picksQuery = useGetAllDraftPicksList({
    projectId,
    enabled: isOpen && hasProject && !scenarioOpen,
  });
  const scenarioPicksQuery = useGetScenarioPicksList({
    projectId,
    scenarioId,
    transactionNo,
    enabled: isOpen && hasProject && scenarioOpen,
  });
  const impactQuery = useGetBidMatchImpact({
    bidType,
    projectId,
    teamId,
    playerId,
    pickId,
    scenarioId: scenarioForBid,
    transactionNo: transactionForBid,
    enabled: isOpen && hasProject,
  });
  const save = useSubmitBidMatch();
  const [saveError, setSaveError] = useState<{
    key: string;
    message: string;
  } | null>(null);
  const payloadKey = `${bidType}|${teamId}|${playerId}|${pickId}`;

  const teams = useMemo(() => teamsQuery.data ?? [], [teamsQuery.data]);
  const picks = useMemo(
    () => (scenarioOpen ? scenarioPicksQuery.data : picksQuery.data) ?? [],
    [scenarioOpen, scenarioPicksQuery.data, picksQuery.data],
  );
  const players = useMemo(() => playersQuery.data ?? [], [playersQuery.data]);
  const clubOptions = useMemo(
    () =>
      teams.map((team) => ({
        label: team.teamNames,
        value: team.id,
        icon: team.image,
      })),
    [teams],
  );
  const playerOptions = useMemo(
    () =>
      players.map((player) => ({
        label: player.fullName,
        value: player.fullName,
      })),
    [players],
  );
  const pickOptions = useMemo(
    () =>
      [...picks]
        .filter((pick) => pick.pickStatus !== "Used")
        .sort(
          (left, right) =>
            left.year - right.year || left.overallPick - right.overallPick,
        )
        .map((pick) => ({
          label: pickOptionLabel(pick),
          value: String(pick.value),
        }))
        .filter((option) => option.label),
    [picks],
  );

  const clubName = teams.find((team) => team.id === teamId)?.teamNames ?? "";
  const selectedPlayer = players.find((player) => player.fullName === playerId);
  const result = impactQuery.data
    ? buildBidMatchResult(
        impactQuery.data,
        clubName,
        selectedPlayer?.fullName ?? "",
        projectYear,
        config.selectionLabel,
      )
    : null;

  const ready = Boolean(teamId && playerId && pickId);
  const previewLoading = ready && impactQuery.isFetching && !impactQuery.data;
  const previewError =
    ready && impactQuery.isError
      ? getErrorMessage(impactQuery.error, BID_MATCH_ERROR)
      : null;

  const handleClose = () => {
    form.reset(BID_MATCH_DEFAULTS);
    setSaveError(null);
    onClose();
  };

  const handleMatch = async () => {
    if (!result?.canProceed || !hasProject || impactQuery.isFetching) return;
    setSaveError(null);
    try {
      await save.mutateAsync({
        bidType,
        projectId,
        teamId,
        playerId,
        pickId,
        scenarioId: scenarioForBid,
        transactionNo: transactionForBid,
      });
      toast.success("Bid matched.");
      handleClose();
    } catch (error) {
      setSaveError({
        key: payloadKey,
        message: getErrorMessage(error, BID_MATCH_ERROR),
      });
    }
  };

  return {
    form,
    config,
    clubOptions,
    playerOptions,
    pickOptions,
    clubsLoading: teamsQuery.isLoading,
    playersLoading: playersQuery.isLoading,
    picksLoading: scenarioOpen
      ? scenarioPicksQuery.isLoading
      : picksQuery.isLoading,
    ready,
    previewLoading,
    previewError,
    result,
    canMatch:
      Boolean(result?.canProceed) && !impactQuery.isFetching && !save.isPending,
    isSubmitting: save.isPending,
    saveError: saveError?.key === payloadKey ? saveError.message : null,
    handleClose,
    handleMatch,
  };
};
