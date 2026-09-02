import { useCreateMovePick } from "@/app/api/react-query/transactions";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import { buildMovePickRequestPayload } from "@/app/api/util/move-pick";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { MovePickFormValues } from "./type";
import {
  buildMovePickOptions,
  canSubmitMovePick,
  isMovePickPosition,
  MOVE_PICK_DEFAULT_VALUES,
  movePickFormSchema,
} from "./util";
import { getErrorMessage } from "@/lib/api-client";

export const useMovePickModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");

  const form = useForm<MovePickFormValues>({
    defaultValues: MOVE_PICK_DEFAULT_VALUES,
    resolver: zodResolver(movePickFormSchema),
  });

  const [pick = "", destinationPick = "", position = "", reason = ""] =
    useWatch({
      control: form.control,
      name: ["pick", "destinationPick", "position", "reason"],
    });

  const { data: allDraftPicks = [], isLoading: picksLoading } =
    useGetAllDraftPicksList({ projectId, enabled: isOpen });

  const pickOptions = useMemo(
    () => buildMovePickOptions(allDraftPicks, destinationPick),
    [allDraftPicks, destinationPick],
  );

  const destinationOptions = useMemo(
    () => buildMovePickOptions(allDraftPicks, pick),
    [allDraftPicks, pick],
  );

  const createMovePick = useCreateMovePick();

  const samePickError = Boolean(
    pick && destinationPick && pick === destinationPick,
  );

  const canSave = canSubmitMovePick({
    pick,
    destinationPick,
    position,
    reason,
  });

  const handleClose = () => {
    form.reset(MOVE_PICK_DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!canSave) return;
    if (!isMovePickPosition(values.position)) return;

    const requestPayload = {
      projectId,
      pick: values.pick,
      destinationPick: values.destinationPick,
      position: values.position,
      reason: values.reason.trim(),
    };

    createMovePick.mutate(requestPayload, {
      onSuccess: () => {
        toast.success("Pick moved successfully");
        promptSaveToCsv({
          transactionType: "Move Pick",
          payload: buildMovePickRequestPayload({
            pick: requestPayload.pick,
            destinationPick: requestPayload.destinationPick,
            position: requestPayload.position,
            reason: requestPayload.reason,
          }),
        });
        handleClose();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Failed to move pick"));
      },
    });
  });

  return {
    form,
    pickOptions,
    destinationOptions,
    picksLoading,
    samePickError,
    canSave,
    isSubmitting: createMovePick.isPending,
    handleClose,
    handleSubmit,
    selectedProject,
  };
};
