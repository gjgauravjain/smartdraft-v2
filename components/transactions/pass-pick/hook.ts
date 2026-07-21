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
import { PassPickFormValues } from "./type";
import {
  buildPassPickOptions,
  PASS_PICK_DEFAULT_VALUES,
  passPickFormSchema,
} from "./util";

export const usePassPickModal = ({ onClose }: { onClose: () => void }) => {
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
    useGetAllDraftPicksList({ projectId });
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
  });

  const createPassPick = useCreatePassPick();

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
          handleClose();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.detail || error.response?.data?.message;
            toast.error(
              typeof message === "string" ? message : "Failed to pass pick(s)",
            );
          }
          toast.error("Failed to pass pick(s)");
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
    impactError: impactQuery.error ?? null,
    canPass,
    isSubmitting: createPassPick.isPending,
    handleClose,
    handleSubmit,
    selectedProject,
  };
};
