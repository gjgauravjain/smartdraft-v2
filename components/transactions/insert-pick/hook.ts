import { useGetTeams } from "@/app/api/react-query/common";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import { useCreateInsertPick } from "@/app/api/react-query/transactions";
import { buildInsertPickRequestPayload } from "@/app/api/util/insert-pick";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { getErrorMessage } from "@/lib/api-client";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { InsertPickFormValues } from "./type";
import {
  buildInsertPickOptions,
  buildInsertPickTeamOptions,
  canSubmitInsertPick,
  INSERT_PICK_DEFAULT_VALUES,
  insertPickFormSchema,
  isInsertPickPosition,
} from "./util";

export const useInsertPickModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");

  const form = useForm<InsertPickFormValues>({
    defaultValues: INSERT_PICK_DEFAULT_VALUES,
    resolver: zodResolver(insertPickFormSchema),
  });

  const [teamId = "", alignedPick = "", position = "", reason = ""] = useWatch({
    control: form.control,
    name: ["teamId", "alignedPick", "position", "reason"],
  });

  const { data: allDraftPicks = [], isLoading: picksLoading } =
    useGetAllDraftPicksList({ projectId, enabled: isOpen });
  const { data: teams = [], isLoading: teamsLoading } = useGetTeams();

  const pickOptions = useMemo(
    () => buildInsertPickOptions(allDraftPicks),
    [allDraftPicks],
  );

  const teamOptions = useMemo(() => buildInsertPickTeamOptions(teams), [teams]);

  const createInsertPick = useCreateInsertPick();

  const canSave = canSubmitInsertPick({
    teamId,
    alignedPick,
    position,
    reason,
  });

  const handleClose = () => {
    form.reset(INSERT_PICK_DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!canSave) return;
    if (!isInsertPickPosition(values.position)) return;

    const requestPayload = {
      projectId,
      teamId: values.teamId,
      alignedPick: values.alignedPick,
      position: values.position,
      reason: values.reason.trim(),
    };

    createInsertPick.mutate(requestPayload, {
      onSuccess: () => {
        toast.success("Pick inserted successfully");
        promptSaveToCsv({
          transactionType: "Insert Pick",
          payload: buildInsertPickRequestPayload({
            teamId: requestPayload.teamId,
            alignedPick: requestPayload.alignedPick,
            position: requestPayload.position,
            reason: requestPayload.reason,
          }),
        });
        handleClose();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Failed to insert pick"));
      },
    });
  });

  return {
    form,
    pickOptions,
    teamOptions,
    picksLoading,
    teamsLoading,
    canSave,
    isSubmitting: createInsertPick.isPending,
    handleClose,
    handleSubmit,
    selectedProject,
  };
};
