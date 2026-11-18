"use client";

import { useGetTeams } from "@/app/api/react-query/common";
import {
  useGetAllDraftPicksList,
  useGetScenarioPicksList,
} from "@/app/api/react-query/draftpicks";
import { useGetPlayersLookup } from "@/app/api/react-query/player";
import {
  useCreateTrade,
  useGetTradeImpact,
} from "@/app/api/react-query/transactions";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { PlayerLookupType } from "@/app/api/type/player";
import { TradeImpactResponse } from "@/app/api/type/trade";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { getErrorMessage } from "@/lib/api-client";
import { resolveOrganisationId } from "@/lib/org-admin";
import { useAuth, useStore } from "@/store/useStore";
import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { TradeLanePlayer, TradePickerTab, TradeTeamFormValues } from "./type";
import {
  TRADE_ERROR,
  activePickerClubId,
  addAssetsToLane,
  addClubLane,
  clubCount,
  clubHandByYear,
  createDefaultLanes,
  hasTradeAsset,
  isTradeReadyToPreview,
  pickerClubGroups,
  pickPointsByUnique,
  playersForLane,
  removeLane,
  removePickFromLane,
  removePlayerFromLane,
  selectedAssetCount,
  selectedPickUniques,
  setLaneClub,
  teamById,
  toggleSelectedPick,
  toggleSelectedPlayer,
  tradePayloadFromLanes,
  tradeStatusModel,
} from "./util";

type UseTradeTeamModalArgs = {
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

export const useTradeTeamModal = ({
  onClose,
  scenarioId,
  transactionNo,
}: UseTradeTeamModalArgs) => {
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
  const scenario =
    scenarioId && transactionNo
      ? { scenarioId, transactionNo }
      : { scenarioId: undefined, transactionNo: undefined };

  const form = useForm<TradeTeamFormValues>({
    defaultValues: { lanes: createDefaultLanes() },
  });
  const watchedLanes = useWatch({ control: form.control, name: "lanes" });
  const lanes = watchedLanes ?? form.getValues("lanes");
  const updateLanes = (
    recipe: (
      current: TradeTeamFormValues["lanes"],
    ) => TradeTeamFormValues["lanes"],
  ) => {
    form.setValue("lanes", recipe(form.getValues("lanes")));
  };

  const [pickerLaneId, setPickerLaneId] = useState<string | null>(null);
  const [pickerTab, setPickerTab] = useState<TradePickerTab>("picks");
  const [pickerClubId, setPickerClubId] = useState("");
  const [selectedPicks, setSelectedPicks] = useState<
    Record<string, DraftPicksDataType>
  >({});
  const [selectedPlayers, setSelectedPlayers] = useState<
    Record<string, PlayerLookupType>
  >({});
  const [playerQuery, setPlayerQueryState] = useState("");
  const [debouncedPlayerQuery, setDebouncedPlayerQuery] = useState("");
  const [blocked, setBlocked] = useState<{
    key: string;
    impact: TradeImpactResponse;
  } | null>(null);
  const [showHand, setShowHand] = useState(false);
  const [handTeamId, setHandTeamId] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teamsQuery = useGetTeams();
  const projectPicks = useGetAllDraftPicksList({
    projectId,
    enabled: hasProject && !scenario.scenarioId,
  });
  const scenarioPicks = useGetScenarioPicksList({
    projectId,
    scenarioId: scenario.scenarioId,
    transactionNo: scenario.transactionNo,
    enabled: hasProject && !!scenario.scenarioId,
  });
  const picksQuery = scenario.scenarioId ? scenarioPicks : projectPicks;
  const playerSearch = debouncedPlayerQuery.trim();
  const playersQuery = useGetPlayersLookup({
    orgId,
    q: playerSearch,
    enabled: !!pickerLaneId,
    loadAll: !playerSearch,
  });

  const readyToPreview = isTradeReadyToPreview(lanes);
  const payload = useMemo(
    () => (readyToPreview ? tradePayloadFromLanes(lanes) : null),
    [lanes, readyToPreview],
  );
  const payloadKey = payload ? JSON.stringify(payload) : "";
  const blockedImpact = blocked?.key === payloadKey ? blocked.impact : null;

  const impactQuery = useGetTradeImpact({
    projectId,
    payload,
    enabled: hasProject && readyToPreview,
    scenarioId: scenario.scenarioId,
    transactionNo: scenario.transactionNo,
  });
  const createTrade = useCreateTrade();

  const teams = useMemo(() => teamsQuery.data ?? [], [teamsQuery.data]);
  const picks = useMemo(() => picksQuery.data ?? [], [picksQuery.data]);
  const teamsMap = useMemo(() => teamById(teams), [teams]);
  const points = useMemo(() => pickPointsByUnique(picks), [picks]);
  const impact = blockedImpact ?? (impactQuery.error ? null : impactQuery.data);
  const status = tradeStatusModel({
    hasProject,
    ready: readyToPreview,
    fetching: impactQuery.isFetching,
    failed: Boolean(impactQuery.error),
    impact,
  });
  const canConfirm =
    hasProject &&
    clubCount(lanes) >= 2 &&
    hasTradeAsset(lanes) &&
    readyToPreview &&
    !impactQuery.isFetching &&
    !impactQuery.error &&
    !!impact &&
    impact.summaryValidity !== "Invalid" &&
    !blockedImpact &&
    !createTrade.isPending;

  const clearSearchTimer = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = null;
  };

  const resetPicker = () => {
    clearSearchTimer();
    setPickerTab("picks");
    setPickerClubId("");
    setSelectedPicks({});
    setSelectedPlayers({});
    setPlayerQueryState("");
    setDebouncedPlayerQuery("");
  };

  const closePicker = () => {
    setPickerLaneId(null);
    resetPicker();
  };

  const handleClose = () => {
    closePicker();
    form.reset({ lanes: createDefaultLanes() });
    setBlocked(null);
    setShowHand(false);
    setHandTeamId("");
    onClose();
  };

  const setPlayerQuery = (value: string) => {
    setPlayerQueryState(value);
    clearSearchTimer();
    searchTimer.current = setTimeout(() => {
      setDebouncedPlayerQuery(value.trim());
    }, 300);
  };

  const setClub = (laneId: string, teamId: string) => {
    updateLanes((current) => setLaneClub(current, laneId, teamId));
    if (pickerLaneId === laneId) closePicker();
  };

  const addClub = (teamId: string) => {
    updateLanes((current) => addClubLane(current, teamId));
  };

  const removeClub = (laneId: string) => {
    updateLanes((current) => removeLane(current, laneId));
    if (pickerLaneId === laneId) closePicker();
  };

  const removePick = (laneId: string, unique: string) => {
    updateLanes((current) => removePickFromLane(current, laneId, unique));
  };

  const removePlayer = (laneId: string, playerId: string) => {
    updateLanes((current) => removePlayerFromLane(current, laneId, playerId));
  };

  const addAssets = (
    laneId: string,
    nextPicks: DraftPicksDataType[],
    nextPlayers: TradeLanePlayer[],
  ) => {
    updateLanes((current) =>
      addAssetsToLane(current, laneId, nextPicks, nextPlayers),
    );
    closePicker();
  };

  const handleConfirm = () => {
    if (!canConfirm || !payload) return;
    createTrade.mutate(
      {
        projectId,
        payload,
        scenarioId: scenario.scenarioId,
        transactionNo: scenario.transactionNo,
      },
      {
        onSuccess: (result) => {
          if (result.kind === "blocked") {
            setBlocked({ key: payloadKey, impact: result.impact });
            return;
          }
          toast.success(result.transactionDescription || "Trade confirmed.");
          promptSaveToCsv({
            transactionType: "Trade",
            payload,
          });
          handleClose();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, TRADE_ERROR));
        },
      },
    );
  };

  const pickerLane = lanes.find((lane) => lane.id === pickerLaneId) ?? null;
  const takenUniques = selectedPickUniques(lanes);
  const pickerGroups = pickerLane
    ? pickerClubGroups(teams, lanes, pickerLane.teamId)
    : { inTrade: [], other: [] };
  const activeClubId = activePickerClubId(pickerClubId, pickerGroups);
  const visiblePlayers = playersQuery.data ?? [];

  const togglePick = (pick: DraftPicksDataType) => {
    setSelectedPicks((current) =>
      toggleSelectedPick(current, pick, takenUniques),
    );
  };

  const togglePlayer = (player: PlayerLookupType) => {
    setSelectedPlayers((current) => toggleSelectedPlayer(current, player));
  };

  const commitPicker = () => {
    if (!pickerLane) return;
    addAssets(
      pickerLane.id,
      Object.values(selectedPicks),
      playersForLane(selectedPlayers),
    );
  };

  return {
    lanes,
    teams,
    teamsMap,
    picks,
    points,
    projectYear,
    impact,
    status,
    previewPending:
      readyToPreview && impactQuery.isFetching && !impact,
    canConfirm,
    isSubmitting: createTrade.isPending,
    teamsLoading: teamsQuery.isLoading,
    picksLoading: picksQuery.isLoading,
    showHand,
    setShowHand,
    handTeamId,
    setHandTeamId,
    pickerLane,
    pickerTab,
    setPickerTab,
    pickerGroups,
    activeClubId,
    setPickerClubId,
    pickerYears: clubHandByYear(picks, String(activeClubId), projectYear),
    selectedPicks,
    selectedPlayers,
    selectedCount: selectedAssetCount(selectedPicks, selectedPlayers),
    takenUniques,
    togglePick,
    togglePlayer,
    commitPicker,
    openPicker: (laneId: string) => {
      resetPicker();
      setPickerLaneId(laneId);
    },
    closePicker,
    playerQuery,
    setPlayerQuery,
    visiblePlayers,
    playersLoading: playersQuery.isFetching && !playersQuery.data,
    playersSearching: playerQuery.trim().length > 0,
    setClub,
    addClub,
    removeClub,
    removePick,
    removePlayer,
    addAssets,
    handleConfirm,
    handleClose,
  };
};
