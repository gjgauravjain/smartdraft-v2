"use client";

import { useGetTeams } from "@/app/api/react-query/common";
import {
  useGetAllDraftPicksList,
  useGetScenarioPicksList,
} from "@/app/api/react-query/draftpicks";
import { useGetPlayersLookup } from "@/app/api/react-query/player";
import {
  useCreateFreeAgentCompensation,
  useGetFreeAgentCompensationImpact,
  useGetFreeAgentPickTypes,
} from "@/app/api/react-query/transactions";
import {
  FreeAgentCompensationFieldErrors,
  FreeAgentCompensationFormInput,
  FreeAgentCompensationPreviewResult,
  FreeAgentCompensationScope,
} from "@/app/api/type/free-agent-compensation";
import {
  buildFreeAgentCompensationRequest,
  freeAgentSuccessMessage,
  isFixedOverallPickType,
  needsAlignedPickFields,
  previewErrorFromUnknown,
} from "@/app/api/util/free-agent-compensation";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { getErrorMessage } from "@/lib/api-client";
import { resolveOrganisationId } from "@/lib/org-admin";
import { useAuth, useStore } from "@/store/useStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  FreeAgentCompensationFormValues,
  FreeAgentCompensationStatusView,
} from "./type";
import {
  FREE_AGENT_DEFAULT_VALUES,
  buildAlignedPickOptions,
  buildClubOptions,
  buildPickTypeOptions,
  clearHiddenFreeAgentFields,
  freeAgentCompensationFormSchema,
} from "./util";

type UseFreeAgentCompensationModalArgs = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

export const useFreeAgentCompensationModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: UseFreeAgentCompensationModalArgs) => {
  const { selectedProject, currentOrganisation } = useStore();
  const { user } = useAuth();
  const projectId = Number(selectedProject?.id || "0");
  const hasProject = Number.isInteger(projectId) && projectId > 0;
  const parsedYear = Number(selectedProject?.year);
  const projectYear = Number.isInteger(parsedYear) ? parsedYear : null;
  const scenarioActive = Boolean(scenarioId && transactionNo);
  const orgId = resolveOrganisationId(
    currentOrganisation,
    user?.organisations ?? [],
  );

  const form = useForm<FreeAgentCompensationFormValues>({
    defaultValues: FREE_AGENT_DEFAULT_VALUES,
  });

  const [
    club = "",
    pickType = "",
    alignedPick = "",
    insert = "",
    overallPick = "",
    playerId = "",
  ] = useWatch({
    control: form.control,
    name: [
      "club",
      "pickType",
      "alignedPick",
      "insert",
      "overallPick",
      "playerId",
    ],
  });

  const { overallPick: settledOverall, pending: overallPending } =
    useSettledOverallPick(
      overallPick,
      `${club}|${pickType}|${alignedPick}|${insert}|${playerId}`,
    );

  const teamsQuery = useGetTeams();
  const pickTypesQuery = useGetFreeAgentPickTypes();
  const playersQuery = useGetPlayersLookup({
    orgId,
    loadAll: true,
    enabled: isOpen && Boolean(orgId),
  });
  const projectPicksQuery = useGetAllDraftPicksList({
    projectId,
    enabled: isOpen && hasProject && !scenarioActive,
  });
  const scenarioPicksQuery = useGetScenarioPicksList({
    projectId,
    scenarioId,
    transactionNo,
    enabled: isOpen && hasProject && scenarioActive,
  });
  const picksQuery = scenarioActive ? scenarioPicksQuery : projectPicksQuery;
  const picks = picksQuery.data ?? [];
  const teams = teamsQuery.data ?? [];
  const players = playersQuery.data ?? [];

  const liveValues = {
    club,
    pickType,
    alignedPick,
    insert,
    overallPick,
    playerId,
  };
  const requestValues = {
    ...liveValues,
    overallPick: settledOverall,
  };
  const liveReady = freeAgentCompensationFormSchema.safeParse({
    ...liveValues,
    playerQuery: "",
  }).success;
  const request = overallPending
    ? null
    : buildFreeAgentCompensationRequest({
        values: requestValues,
        picks,
        players,
        projectYear,
      });

  const scope: FreeAgentCompensationScope = {
    projectId,
    scenarioId,
    transactionNo,
  };
  const impactQuery = useGetFreeAgentCompensationImpact({
    scope,
    payload: request,
    enabled: isOpen && hasProject,
  });
  const createCompensation = useCreateFreeAgentCompensation();
  const requestKey = request ? JSON.stringify(request) : "";
  const [saveState, setSaveState] = useState<{
    requestKey: string;
    error: Exclude<FreeAgentCompensationPreviewResult, { kind: "success" }> | null;
  }>({ requestKey: "", error: null });
  const saveError =
    saveState.requestKey === requestKey ? saveState.error : null;
  const preview = impactQuery.preview;
  const previousPickType = useRef(pickType);

  useEffect(() => {
    if (previousPickType.current === pickType) return;
    previousPickType.current = pickType;
    clearHiddenFreeAgentFields(pickType, (name, value) => {
      form.setValue(name, value);
    });
  }, [pickType, form]);

  useEffect(() => {
    const fieldErrors = fieldErrorsFrom(saveError, preview);
    const names: (keyof FreeAgentCompensationFormInput)[] = [
      "club",
      "pickType",
      "alignedPick",
      "insert",
      "overallPick",
      "playerId",
    ];
    names.forEach((name) => {
      const message = fieldErrors?.[name];
      if (!message) {
        form.clearErrors(name);
        return;
      }
      form.setError(name, { type: "server", message });
    });
  }, [saveError, preview, form]);

  const canAdd =
    !overallPending &&
    !impactQuery.isFetching &&
    preview?.kind === "success" &&
    request !== null;

  const handleClose = () => {
    form.reset(FREE_AGENT_DEFAULT_VALUES);
    setSaveState({ requestKey: "", error: null });
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canAdd || !request) return;

    const submittedKey = requestKey;
    setSaveState({ requestKey: submittedKey, error: null });
    createCompensation.mutate(
      { scope, payload: request },
      {
        onSuccess: (data) => {
          toast.success(freeAgentSuccessMessage(data));
          promptSaveToCsv({
            transactionType: "Free Agent Compensation",
            payload: request,
          });
          handleClose();
        },
        onError: (error) => {
          setSaveState({
            requestKey: submittedKey,
            error: previewErrorFromUnknown(error),
          });
        },
      },
    );
  };

  const selectedTeam = teams.find((team) => team.id === club) ?? null;

  return {
    form,
    clubOptions: buildClubOptions(teams),
    pickTypeOptions: buildPickTypeOptions(pickTypesQuery.data ?? []),
    alignedPickOptions: buildAlignedPickOptions(picks, projectYear),
    players,
    teams,
    clubsLoading: teamsQuery.isLoading,
    pickTypesLoading: pickTypesQuery.isLoading,
    picksLoading: picksQuery.isLoading,
    playersLoading: playersQuery.isLoading,
    showAlignedFields: needsAlignedPickFields(pickType),
    showOverallPick: isFixedOverallPickType(pickType),
    referenceError: referenceErrorMessage({
      teamsError: teamsQuery.isError ? teamsQuery.error : null,
      pickTypesError: pickTypesQuery.isError ? pickTypesQuery.error : null,
      picksError: picksQuery.isError ? picksQuery.error : null,
      playersError: playersQuery.isError ? playersQuery.error : null,
      missingOrganisation: !orgId,
    }),
    status: buildStatus({
      saveError,
      overallPending,
      liveReady,
      picksLoading: picksQuery.isLoading,
      playersLoading: playersQuery.isLoading,
      picksFailed: picksQuery.isError,
      playersFailed: playersQuery.isError,
      impactFetching: impactQuery.isFetching,
      preview,
      hasRequest: request !== null,
    }),
    team: selectedTeam,
    draftYear: projectYear,
    canAdd,
    isSubmitting: createCompensation.isPending,
    handleClose,
    handleSubmit,
  };
};

const useSettledOverallPick = (overallPick: string, selectKey: string) => {
  const [settled, setSettled] = useState(overallPick);
  const [trackedSelectKey, setTrackedSelectKey] = useState(selectKey);

  if (selectKey !== trackedSelectKey) {
    setTrackedSelectKey(selectKey);
    setSettled(overallPick);
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => setSettled(overallPick), 400);
    return () => window.clearTimeout(timeout);
  }, [overallPick]);

  return {
    overallPick: settled,
    pending: settled !== overallPick,
  };
};

const fieldErrorsFrom = (
  saveError: Exclude<
    FreeAgentCompensationPreviewResult,
    { kind: "success" }
  > | null,
  preview: FreeAgentCompensationPreviewResult | null,
): FreeAgentCompensationFieldErrors | null => {
  if (saveError?.kind === "field") return saveError.fieldErrors;
  if (preview?.kind === "field") return preview.fieldErrors;
  return null;
};

const referenceErrorMessage = ({
  teamsError,
  pickTypesError,
  picksError,
  playersError,
  missingOrganisation,
}: {
  teamsError: unknown;
  pickTypesError: unknown;
  picksError: unknown;
  playersError: unknown;
  missingOrganisation: boolean;
}) => {
  if (teamsError) return getErrorMessage(teamsError, "Could not load clubs.");
  if (pickTypesError) {
    return getErrorMessage(pickTypesError, "Could not load pick types.");
  }
  if (picksError) return getErrorMessage(picksError, "Could not load picks.");
  if (missingOrganisation) return "Choose an organisation to load players.";
  if (playersError) {
    return getErrorMessage(playersError, "Could not load players.");
  }
  return null;
};

const buildStatus = ({
  saveError,
  overallPending,
  liveReady,
  picksLoading,
  playersLoading,
  picksFailed,
  playersFailed,
  impactFetching,
  preview,
  hasRequest,
}: {
  saveError: Exclude<
    FreeAgentCompensationPreviewResult,
    { kind: "success" }
  > | null;
  overallPending: boolean;
  liveReady: boolean;
  picksLoading: boolean;
  playersLoading: boolean;
  picksFailed: boolean;
  playersFailed: boolean;
  impactFetching: boolean;
  preview: FreeAgentCompensationPreviewResult | null;
  hasRequest: boolean;
}): FreeAgentCompensationStatusView => {
  if (saveError?.kind === "field") {
    return { kind: "field", messages: saveError.messages };
  }
  if (saveError?.kind === "server") {
    return { kind: "server", message: saveError.message };
  }
  if (
    (overallPending && liveReady) ||
    (picksLoading && liveReady) ||
    (playersLoading && liveReady) ||
    impactFetching
  ) {
    return { kind: "loading" };
  }
  if (preview?.kind === "success") {
    return { kind: "success", impact: preview.impact };
  }
  if (preview?.kind === "field") {
    return { kind: "field", messages: preview.messages };
  }
  if (preview?.kind === "server") {
    return { kind: "server", message: preview.message };
  }
  if (
    liveReady &&
    !picksLoading &&
    !playersLoading &&
    !picksFailed &&
    !playersFailed &&
    !overallPending &&
    !hasRequest
  ) {
    return {
      kind: "server",
      message:
        "No unused pick in this draft year is available to place the compensation pick.",
    };
  }
  return { kind: "idle" };
};
