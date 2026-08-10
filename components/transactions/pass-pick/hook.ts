import {
  useCreatePassPick,
  useGetPassPickImpact,
} from "@/app/api/react-query/transactions";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import { useGetTeams } from "@/app/api/react-query/common";
import { PassPickPassType } from "@/app/api/type/pass-pick";
import { useStore } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { buildPassPickRequestPayload } from "@/app/api/util/pass-pick";
import { PassPickFormValues } from "./type";
import {
  buildPassPickOptions,
  PASS_PICK_DEFAULT_VALUES,
  passPickFormSchema,
} from "./util";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.detail || error.response?.data?.message;
    if (typeof message === "string") return message;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const usePassPickModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");

  const form = useForm<PassPickFormValues>({
    defaultValues: PASS_PICK_DEFAULT_VALUES,
    resolver: zodResolver(passPickFormSchema),
  });

  const [pickId = "", selectedPassPick = "ONE"] = useWatch({
    control: form.control,
    name: ["pickId", "selectedPassPick"],
  });

  const { data: allDraftPicks = [], isLoading: picksLoading } =
    useGetAllDraftPicksList({ projectId, enabled: isOpen });
  const { data: teams = [] } = useGetTeams();

  const teamNamesById = useMemo(() => {
    const map = new Map<string, string>();
    teams.forEach((team) => map.set(String(team.id), team.teamNames));
    return map;
  }, [teams]);

  const pickOptions = useMemo(
    () => buildPassPickOptions({ picks: allDraftPicks, teamNamesById }),
    [allDraftPicks, teamNamesById],
  );

  const readyToFetch = Boolean(pickId && selectedPassPick);

  const impactQuery = useGetPassPickImpact({
    projectId,
    pickId,
    passType: selectedPassPick as PassPickPassType,
    enabled: isOpen && readyToFetch,
  });

  const createPassPick = useCreatePassPick();

  const impactErrorMessage = impactQuery.error
    ? getErrorMessage(
        impactQuery.error,
        "Failed to load pass impact preview",
      )
    : null;

  const canPass =
    readyToFetch &&
    !impactQuery.isFetching &&
    !impactQuery.isError &&
    Boolean(impactQuery.data?.picksPassed.length);

  const handleClose = () => {
    form.reset(PASS_PICK_DEFAULT_VALUES);
    onClose();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!canPass) return;

    createPassPick.mutate(
      {
        projectId,
        pickId: values.pickId,
        passType: values.selectedPassPick,
      },
      {
        onSuccess: () => {
          toast.success("Pick(s) passed successfully");
          promptSaveToCsv({
            transactionType: "Pass Pick",
            payload: buildPassPickRequestPayload({
              pickId: values.pickId,
              passType: values.selectedPassPick,
            }),
          });
          handleClose();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Failed to pass pick(s)"));
        },
      },
    );
  });

  return {
    form,
    pickId,
    pickOptions,
    picksLoading,
    selectedPassPick,
    impactData: impactQuery.data ?? null,
    impactLoading: impactQuery.isFetching,
    impactError: impactErrorMessage,
    canPass,
    isSubmitting: createPassPick.isPending,
    handleClose,
    handleSubmit,
    selectedProject,
  };
};
