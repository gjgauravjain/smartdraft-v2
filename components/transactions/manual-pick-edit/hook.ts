import { useCreateManualPickEdit } from "@/app/api/react-query/transactions";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import { useGetTeams } from "@/app/api/react-query/common";
import { ManualPickEditReason } from "@/app/api/type/manual-pick-edit";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ManualPickEditFormValues } from "./type";
import {
  buildManualPickEditPickOptions,
  buildTeamOptions,
  MANUAL_PICK_EDIT_DEFAULT_VALUES,
  manualPickEditFormSchema,
} from "./util";

export const useManualPickEditModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");

  const form = useForm<ManualPickEditFormValues>({
    defaultValues: MANUAL_PICK_EDIT_DEFAULT_VALUES,
    resolver: zodResolver(manualPickEditFormSchema),
  });

  const [pickId = "", newOwnerId = "", reason = ""] = useWatch({
    control: form.control,
    name: ["pickId", "newOwnerId", "reason"],
  });

  const { data: allDraftPicks = [], isLoading: picksLoading } =
    useGetAllDraftPicksList({ projectId });
  const { data: teams = [], isLoading: teamsLoading } = useGetTeams();

  const picksById = useMemo(() => {
    const map = new Map<string, (typeof allDraftPicks)[number]>();
    allDraftPicks.forEach((pick) => map.set(String(pick.value), pick));
    return map;
  }, [allDraftPicks]);

  const selectedPick = pickId ? picksById.get(pickId) : undefined;
  const currentOwnerId = selectedPick ? String(selectedPick.currentOwner) : "";

  const pickOptions = useMemo(
    () => buildManualPickEditPickOptions(allDraftPicks),
    [allDraftPicks],
  );

  const teamOptions = useMemo(() => buildTeamOptions(teams), [teams]);

  const createManualPickEdit = useCreateManualPickEdit();

  const sameOwnerError = Boolean(
    pickId && newOwnerId && newOwnerId === currentOwnerId,
  );

  const canSave =
    Boolean(pickId && newOwnerId && reason) &&
    !sameOwnerError &&
    (reason === "Carry Over Trade" || reason === "Other");

  const handleClose = () => {
    form.reset(MANUAL_PICK_EDIT_DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!canSave) return;

    const pick = picksById.get(values.pickId);
    if (!pick) {
      toast.error("Selected pick could not be found");
      return;
    }

    createManualPickEdit.mutate(
      {
        projectId,
        pickLabel: pick.label,
        uniquePick: pick.unique,
        newOwnerId: values.newOwnerId,
        viaOwnerId: values.viaOwnerId || undefined,
        reason: values.reason as ManualPickEditReason,
      },
      {
        onSuccess: () => {
          toast.success("Pick owner updated successfully");
          handleClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.detail || error.response?.data?.message;
            toast.error(
              typeof message === "string"
                ? message
                : "Failed to update pick owner",
            );
            return;
          }
          toast.error("Failed to update pick owner");
        },
      },
    );
  });

  return {
    form,
    pickOptions,
    teamOptions,
    picksLoading,
    teamsLoading,
    selectedPick,
    sameOwnerError,
    canSave,
    isSubmitting: createManualPickEdit.isPending,
    handleClose,
    handleSubmit,
    selectedProject,
  };
};
