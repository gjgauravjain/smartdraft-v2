import {
  useEnterDraftMode,
  useFetchRosterSpots,
  useUpdateRosterSpots,
} from "@/app/api/react-query/roster-spots";
import { useGetTeams } from "@/app/api/react-query/common";
import { ListSpotsGridData, RosterSpotApi } from "@/app/api/type/roster-spots";
import {
  getChangedRosterSpots,
  transformFlatSpotsToGrid,
  transformGridToFlatSpots,
} from "@/app/api/util/roster-spots";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { UploadCsvTransactionType, useStore } from "@/store/useStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-client";

export const useEnterDraftModeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { selectedProject } = useStore();
  const projectId = Number(selectedProject?.id || "0");

  const { data: initialSpots = [], isLoading: spotsLoading } =
    useFetchRosterSpots({
      projectId,
      enabled: isOpen,
    });
  const { data: teams = [] } = useGetTeams();

  const [grid, setGrid] = useState<ListSpotsGridData>({ years: [], rows: [] });

  const updateRosterSpots = useUpdateRosterSpots();
  const enterDraftMode = useEnterDraftMode();

  useEffect(() => {
    if (initialSpots.length) {
      setGrid(transformFlatSpotsToGrid(initialSpots));
    }
  }, [initialSpots]);

  const teamsById = useMemo(() => {
    const map = new Map<string, (typeof teams)[number]>();
    teams.forEach((team) => map.set(String(team.id), team));
    return map;
  }, [teams]);

  const currentSpots = useMemo(() => transformGridToFlatSpots(grid), [grid]);

  const handleSpotChange = useCallback(
    (teamId: number, year: number, value: number) => {
      setGrid((prev) => ({
        ...prev,
        rows: prev.rows.map((row) =>
          row.teamId === teamId
            ? {
                ...row,
                spotsByYear: {
                  ...row.spotsByYear,
                  [year]: value,
                },
              }
            : row,
        ),
      }));
    },
    [],
  );

  const handleClose = () => {
    if (initialSpots.length) {
      setGrid(transformFlatSpotsToGrid(initialSpots));
    }
    onClose();
  };

  const handleSubmit = async () => {
    if (!projectId || spotsLoading || !initialSpots.length) return;

    const changedSpots = getChangedRosterSpots(
      initialSpots,
      currentSpots,
    ) as RosterSpotApi[];

    try {
      const csvPrompts: UploadCsvTransactionType[] = [];

      if (changedSpots.length > 0) {
        await updateRosterSpots.mutateAsync({
          projectId,
          spots: changedSpots,
        });
        toast.success("List spots updated");
        csvPrompts.push({
          transactionType: "Update Roster Spots",
          payload: currentSpots,
        });
      }

      await enterDraftMode.mutateAsync({ projectId });
      toast.success("Draft mode entered successfully");
      csvPrompts.push({
        transactionType: "Enter Draft Mode",
        payload: {},
      });

      promptSaveToCsv(...csvPrompts);
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to enter draft mode"));
    }
  };

  const isSubmitting = updateRosterSpots.isPending || enterDraftMode.isPending;
  const canSubmit = Boolean(projectId && initialSpots.length && !spotsLoading);

  return {
    grid,
    teamsById,
    spotsLoading,
    isSubmitting,
    canSubmit,
    handleClose,
    handleSubmit,
    handleSpotChange,
    selectedProject,
  };
};
