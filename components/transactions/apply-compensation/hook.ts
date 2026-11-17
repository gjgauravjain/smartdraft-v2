"use client";

import { useGetTeams } from "@/app/api/react-query/common";
import {
  useApplyCompensation,
  useGetApplyCompensationImpact,
} from "@/app/api/react-query/transactions";
import {
  ApplyCompensationPick,
  ApplyCompensationScope,
} from "@/app/api/type/apply-compensation";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { toast } from "sonner";
import { ApplyCompensationView } from "./type";
import {
  APPLY_COMPENSATION_SERVER_ERROR,
  applyCompensationErrorMessages,
  applyCompensationSuccessMessage,
} from "./util";

type UseApplyCompensationModalArgs = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

export const useApplyCompensationModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: UseApplyCompensationModalArgs) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");
  const hasProject = Number.isInteger(projectId) && projectId > 0;
  const scope: ApplyCompensationScope = {
    projectId,
    scenarioId,
    transactionNo,
  };

  const teamsQuery = useGetTeams();
  const impactQuery = useGetApplyCompensationImpact({
    scope,
    enabled: isOpen && hasProject,
  });
  const applyCompensation = useApplyCompensation();
  const [saveState, setSaveState] = useState<{
    updatedAt: number;
    messages: string[];
  } | null>(null);

  const saveError =
    saveState && saveState.updatedAt === impactQuery.dataUpdatedAt
      ? saveState.messages
      : [];

  const view = compensationView({
    hasProject,
    isFetching: impactQuery.isFetching,
    isPending: impactQuery.isPending,
    isError: impactQuery.isError,
    picks: impactQuery.data?.picks ?? [],
    saveError,
  });

  const handleClose = () => {
    setSaveState(null);
    onClose();
  };

  const handleApply = () => {
    if (view.kind !== "ready" || applyCompensation.isPending || !hasProject) {
      return;
    }

    setSaveState(null);
    applyCompensation.mutate(scope, {
      onSuccess: (data) => {
        toast.success(applyCompensationSuccessMessage(data));
        promptSaveToCsv({
          transactionType: "Apply Compensation",
          payload: {},
        });
        handleClose();
      },
      onError: (error) => {
        setSaveState({
          updatedAt: impactQuery.dataUpdatedAt,
          messages: applyCompensationErrorMessages(error),
        });
      },
    });
  };

  return {
    view,
    teams: teamsQuery.data ?? [],
    isSubmitting: applyCompensation.isPending,
    handleClose,
    handleApply,
  };
};

const compensationView = ({
  hasProject,
  isFetching,
  isPending,
  isError,
  picks,
  saveError,
}: {
  hasProject: boolean;
  isFetching: boolean;
  isPending: boolean;
  isError: boolean;
  picks: ApplyCompensationPick[];
  saveError: string[];
}): ApplyCompensationView => {
  if (!hasProject || isFetching || isPending) return { kind: "loading" };
  if (isError) {
    return { kind: "error", messages: [APPLY_COMPENSATION_SERVER_ERROR] };
  }
  if (!picks.length) return { kind: "empty" };
  return { kind: "ready", picks, saveError };
};
