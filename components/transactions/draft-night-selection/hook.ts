"use client";

import { useGetTeams } from "@/app/api/react-query/common";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import { useGetDraftPool } from "@/app/api/react-query/player";
import { useCreateDraftNightSelection } from "@/app/api/react-query/transactions";
import { DraftPoolPlayer } from "@/app/api/type/player";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { resolveOrganisationId } from "@/lib/org-admin";
import { useAuth, useStore } from "@/store/useStore";
import { FormEvent, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { DraftNightPanel, DraftNightSelectionFormValues } from "./type";
import {
  DRAFT_NIGHT_DEFAULT_VALUES,
  availableDraftPicks,
  buildDraftNightRequest,
  draftNightErrorMessages,
  draftNightSuccessMessage,
  filterDraftPicks,
  pickYears,
} from "./util";

type UseDraftNightSelectionModalArgs = {
  isOpen: boolean;
  onClose: () => void;
};

export const useDraftNightSelectionModal = ({
  isOpen,
  onClose,
}: UseDraftNightSelectionModalArgs) => {
  const { selectedProject, currentOrganisation } = useStore();
  const { user } = useAuth();
  const projectId = Number(selectedProject?.id || "0");
  const hasProject = Number.isInteger(projectId) && projectId > 0;
  const parsedYear = Number(selectedProject?.year);
  const projectYear =
    Number.isInteger(parsedYear) && parsedYear >= 1900 ? parsedYear : null;
  const orgId = resolveOrganisationId(
    currentOrganisation,
    user?.organisations ?? [],
  );

  const form = useForm<DraftNightSelectionFormValues>({
    defaultValues: DRAFT_NIGHT_DEFAULT_VALUES,
  });
  const [pickId = "", playerId = ""] = useWatch({
    control: form.control,
    name: ["pickId", "playerId"],
  });

  const [openPanel, setOpenPanel] = useState<DraftNightPanel | null>(null);
  const [pickQuery, setPickQuery] = useState("");
  const [playerQuery, setPlayerQuery] = useState("");
  const [debouncedPlayerQuery, setDebouncedPlayerQuery] = useState("");
  const playerSearchTimer = useRef<number | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [chosenPlayer, setChosenPlayer] = useState<DraftPoolPlayer | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string[] | null>(null);

  const teamsQuery = useGetTeams();
  const picksQuery = useGetAllDraftPicksList({
    projectId,
    enabled: isOpen && hasProject,
  });
  const playersQuery = useGetDraftPool({
    orgId,
    draftYear: projectYear,
    projectId,
    q: debouncedPlayerQuery,
    enabled: isOpen && hasProject,
  });
  const createDraft = useCreateDraftNightSelection();

  const availablePicks = useMemo(
    () => availableDraftPicks(picksQuery.data ?? []),
    [picksQuery.data],
  );
  const years = useMemo(
    () => pickYears(availablePicks, projectYear),
    [availablePicks, projectYear],
  );
  const activeYear =
    yearFilter ?? projectYear ?? availablePicks[0]?.year ?? null;
  const visiblePicks = useMemo(
    () => filterDraftPicks(availablePicks, activeYear, pickQuery),
    [availablePicks, activeYear, pickQuery],
  );

  const selectedPick =
    availablePicks.find((pick) => String(pick.value) === pickId) ?? null;
  const selectedPlayer =
    chosenPlayer && String(chosenPlayer.id) === playerId ? chosenPlayer : null;
  const request = buildDraftNightRequest(selectedPick, selectedPlayer);
  const players = playersQuery.data ?? [];

  const resetForm = () => {
    form.reset(DRAFT_NIGHT_DEFAULT_VALUES);
    setChosenPlayer(null);
    setOpenPanel(null);
    setPickQuery("");
    setPlayerQuery("");
    setDebouncedPlayerQuery("");
    if (playerSearchTimer.current) {
      window.clearTimeout(playerSearchTimer.current);
    }
    setYearFilter(null);
    setSaveError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const closePanel = () => setOpenPanel(null);

  const setPlayerSearch = (value: string) => {
    setPlayerQuery(value);
    if (playerSearchTimer.current) {
      window.clearTimeout(playerSearchTimer.current);
    }
    const search = value.trim();
    if (search.length < 2) {
      setDebouncedPlayerQuery("");
      return;
    }
    playerSearchTimer.current = window.setTimeout(() => {
      setDebouncedPlayerQuery(search);
    }, 300);
  };

  const togglePanel = (panel: DraftNightPanel) => {
    setOpenPanel((current) => (current === panel ? null : panel));
    if (panel === "pick") setPickQuery("");
    if (panel === "player") setPlayerSearch("");
  };

  const selectPick = (nextPickId: string) => {
    form.setValue("pickId", nextPickId);
    setSaveError(null);
    setOpenPanel(null);
  };

  const selectPlayer = (player: DraftPoolPlayer) => {
    form.setValue("playerId", String(player.id));
    setChosenPlayer(player);
    setSaveError(null);
    setOpenPanel(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!request || !hasProject || createDraft.isPending) return;

    setSaveError(null);
    createDraft.mutate(
      { projectId, payload: request },
      {
        onSuccess: (data) => {
          toast.success(draftNightSuccessMessage(data));
          promptSaveToCsv({
            transactionType: "Draft Night Selection",
            payload: request,
          });
          handleClose();
        },
        onError: (error) => {
          setSaveError(draftNightErrorMessages(error));
        },
      },
    );
  };

  return {
    form,
    teams: teamsQuery.data ?? [],
    years,
    yearFilter: activeYear,
    setYearFilter,
    visiblePicks,
    players,
    pickQuery,
    setPickQuery,
    playerQuery,
    setPlayerQuery: setPlayerSearch,
    openPanel,
    togglePanel,
    selectPick,
    selectPlayer,
    selectedPick,
    selectedPlayer,
    closePanel,
    picksLoading: picksQuery.isLoading,
    picksError: picksQuery.isError ? "Couldn't load picks." : null,
    playersLoading: playersQuery.isLoading,
    playersError: playersQuery.isError ? "Couldn't load players." : null,
    saveError: saveError ?? [],
    canDraft: request !== null && !createDraft.isPending,
    isSubmitting: createDraft.isPending,
    handleClose,
    handleSubmit,
  };
};
