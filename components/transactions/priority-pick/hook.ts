"use client";

import { useGetScenarioPicksList, useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import { useGetTeams } from "@/app/api/react-query/common";
import {
  useCreatePriorityPick,
  useGetPriorityPickImpact,
  useGetPriorityPickTypes,
} from "@/app/api/react-query/transactions";
import {
  PriorityPickFieldErrors,
  PriorityPickPreviewResult,
  PriorityPickScope,
} from "@/app/api/type/priority-pick";
import { getErrorMessage } from "@/lib/api-client";
import {
  buildPriorityPickRequest,
  isFixedOverallPickType,
  needsAlignedPickFields,
  previewErrorFromUnknown,
  priorityPickSuccessMessage,
} from "@/app/api/util/priority-pick";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { useStore } from "@/store/useStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { PriorityPickFormValues, PriorityPickStatusView } from "./type";
import {
  buildAlignedPickOptions,
  buildClubOptions,
  buildPickTypeOptions,
  clearHiddenPriorityPickFields,
  PRIORITY_PICK_DEFAULT_VALUES,
  priorityPickFormSchema,
} from "./util";

type UsePriorityPickModalArgs = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

export const usePriorityPickModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: UsePriorityPickModalArgs) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");
  const hasProject = Number.isInteger(projectId) && projectId > 0;
  const parsedYear = Number(selectedProject?.year);
  const projectYear = Number.isInteger(parsedYear) ? parsedYear : null;
  const scenarioActive = Boolean(scenarioId && transactionNo);

  const form = useForm<PriorityPickFormValues>({
    defaultValues: PRIORITY_PICK_DEFAULT_VALUES,
  });

  const [club = "", pickType = "", alignedPick = "", insert = "", overallPick = "", reason = ""] =
    useWatch({
      control: form.control,
      name: ["club", "pickType", "alignedPick", "insert", "overallPick", "reason"],
    });

  const { settled, pending: textPending } = useSettledPriorityPickText(
    reason,
    overallPick,
    `${club}|${pickType}|${alignedPick}|${insert}`,
  );

  const teamsQuery = useGetTeams();
  const pickTypesQuery = useGetPriorityPickTypes();
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

  const liveValues: PriorityPickFormValues = {
    club,
    pickType,
    alignedPick,
    insert,
    overallPick,
    reason,
  };
  const requestValues: PriorityPickFormValues = {
    club,
    pickType,
    alignedPick,
    insert,
    overallPick: settled.overallPick,
    reason: settled.reason,
  };
  const liveReady = priorityPickFormSchema.safeParse(liveValues).success;
  const request = textPending
    ? null
    : buildPriorityPickRequest({
        values: requestValues,
        picks,
        projectId,
        projectYear,
      });

  const scope: PriorityPickScope = {
    projectId,
    scenarioId,
    transactionNo,
  };
  const impactQuery = useGetPriorityPickImpact({
    scope,
    payload: request,
    enabled: isOpen && hasProject,
  });
  const createPriorityPick = useCreatePriorityPick();
  const requestKey = request ? JSON.stringify(request) : "";
  const [saveState, setSaveState] = useState<{
    requestKey: string;
    error: Exclude<PriorityPickPreviewResult, { kind: "success" }> | null;
  }>({ requestKey: "", error: null });
  const saveError =
    saveState.requestKey === requestKey ? saveState.error : null;

  const preview = impactQuery.preview;
  const previousPickType = useRef(pickType);

  useEffect(() => {
    if (previousPickType.current === pickType) return;
    previousPickType.current = pickType;
    clearHiddenPriorityPickFields(pickType, (name, value) => {
      form.setValue(name, value);
    });
  }, [pickType, form]);

  useEffect(() => {
    const fieldErrors = fieldErrorsFrom(saveError, preview);
    const names: (keyof PriorityPickFormValues)[] = [
      "club",
      "pickType",
      "alignedPick",
      "insert",
      "overallPick",
      "reason",
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
    !textPending &&
    !impactQuery.isFetching &&
    preview?.kind === "success" &&
    request !== null;

  const handleClose = () => {
    form.reset(PRIORITY_PICK_DEFAULT_VALUES);
    setSaveState({ requestKey: "", error: null });
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canAdd || !request) return;

    const submittedKey = requestKey;
    setSaveState({ requestKey: submittedKey, error: null });
    createPriorityPick.mutate(
      { scope, payload: request },
      {
        onSuccess: (data) => {
          toast.success(priorityPickSuccessMessage(data));
          promptSaveToCsv({
            transactionType: "Priority Pick",
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
    clubsLoading: teamsQuery.isLoading,
    pickTypesLoading: pickTypesQuery.isLoading,
    picksLoading: picksQuery.isLoading,
    showAlignedFields: needsAlignedPickFields(pickType),
    showOverallPick: isFixedOverallPickType(pickType),
    referenceError: referenceErrorMessage({
      teamsError: teamsQuery.isError ? teamsQuery.error : null,
      pickTypesError: pickTypesQuery.isError ? pickTypesQuery.error : null,
      picksError: picksQuery.isError ? picksQuery.error : null,
    }),
    status: buildStatus({
      saveError,
      textPending,
      liveReady,
      picksLoading: picksQuery.isLoading,
      picksFailed: picksQuery.isError,
      impactFetching: impactQuery.isFetching,
      preview,
      hasRequest: request !== null,
    }),
    team: selectedTeam,
    draftYear: projectYear,
    canAdd,
    isSubmitting: createPriorityPick.isPending,
    handleClose,
    handleSubmit,
  };
};

const useSettledPriorityPickText = (
  reason: string,
  overallPick: string,
  selectKey: string,
) => {
  const [settled, setSettled] = useState({ reason, overallPick });
  const [trackedSelectKey, setTrackedSelectKey] = useState(selectKey);

  if (selectKey !== trackedSelectKey) {
    setTrackedSelectKey(selectKey);
    setSettled({ reason, overallPick });
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSettled({ reason, overallPick });
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [reason, overallPick]);

  return {
    settled,
    pending: settled.reason !== reason || settled.overallPick !== overallPick,
  };
};

const fieldErrorsFrom = (
  saveError: Exclude<PriorityPickPreviewResult, { kind: "success" }> | null,
  preview: PriorityPickPreviewResult | null,
): PriorityPickFieldErrors | null => {
  if (saveError?.kind === "field") return saveError.fieldErrors;
  if (preview?.kind === "field") return preview.fieldErrors;
  return null;
};

const referenceErrorMessage = ({
  teamsError,
  pickTypesError,
  picksError,
}: {
  teamsError: unknown;
  pickTypesError: unknown;
  picksError: unknown;
}) => {
  if (teamsError) return getErrorMessage(teamsError, "Could not load clubs.");
  if (pickTypesError) {
    return getErrorMessage(pickTypesError, "Could not load pick types.");
  }
  if (picksError) return getErrorMessage(picksError, "Could not load picks.");
  return null;
};

const buildStatus = ({
  saveError,
  textPending,
  liveReady,
  picksLoading,
  picksFailed,
  impactFetching,
  preview,
  hasRequest,
}: {
  saveError: Exclude<PriorityPickPreviewResult, { kind: "success" }> | null;
  textPending: boolean;
  liveReady: boolean;
  picksLoading: boolean;
  picksFailed: boolean;
  impactFetching: boolean;
  preview: PriorityPickPreviewResult | null;
  hasRequest: boolean;
}): PriorityPickStatusView => {
  if (saveError?.kind === "field") {
    return { kind: "field", messages: saveError.messages };
  }
  if (saveError?.kind === "server") {
    return { kind: "server", message: saveError.message };
  }
  if ((textPending && liveReady) || (picksLoading && liveReady) || impactFetching) {
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
  if (liveReady && !picksLoading && !picksFailed && !textPending && !hasRequest) {
    return {
      kind: "server",
      message:
        "No unused pick in this draft year is available to place the priority pick.",
    };
  }
  return { kind: "idle" };
};
