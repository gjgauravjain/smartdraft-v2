import { useGetTeams } from "@/app/api/react-query/common";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import {
  useGetPlayerList,
  useGetPlayerListByTalentOrder,
  useGetTalentOrder,
} from "@/app/api/react-query/player";
import {
  useCreateTrade,
  useGetTradeImpact,
} from "@/app/api/react-query/transactions";
import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { PlayerDatabaseType } from "@/app/api/type/player";
import { TradeImpactResponse } from "@/app/api/type/trade";
import { buildTradeRequestPayload } from "@/app/api/util/trade";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { promptSaveToCsv } from "@/components/transactions/upload-csv/prompt";
import { getErrorMessage } from "@/lib/api-client";
import { useStore } from "@/store/useStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PlayerSource } from "../father-son/PlayerSelect";
import { TradeLane, TradeLanePlayer } from "./type";
import {
  addPickToLane,
  addPlayerToLane,
  buildClubOptions,
  createDefaultLanes,
  createEmptyLane,
  groupTradePicks,
  isTradeReadyToPreview,
  selectedPickUniques,
  selectedPlayerIds,
  sumLanePickPoints,
  toLanePlayer,
} from "./util";

export const useTradeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { selectedProject, currentOrganisation } = useStore();
  const projectId = Number(selectedProject?.id || "0");

  const [lanes, setLanes] = useState<TradeLane[]>(createDefaultLanes);
  const [playerSource, setPlayerSource] = useState<PlayerSource>("all");
  const [talentOrderId, setTalentOrderId] = useState("");
  const [commitImpact, setCommitImpact] = useState<TradeImpactResponse | null>(
    null,
  );

  const { data: teams = [], isLoading: teamsLoading } = useGetTeams();
  const { data: allDraftPicks = [], isLoading: picksLoading } =
    useGetAllDraftPicksList({ projectId, enabled: isOpen });
  const { data: players = [] } = useGetPlayerList({
    orgId: currentOrganisation || "",
  });
  const { data: talentOrder } = useGetTalentOrder();
  const { data: playersByTalentOrder = [] } = useGetPlayerListByTalentOrder({
    talentOrder: talentOrderId,
  });

  const talentOrderOptions: SelectOption[] = useMemo(
    () =>
      (talentOrder ?? []).map((order) => ({
        value: String(order.id),
        label: `${order.name}${order.isDefault ? " (Default)" : ""}`,
      })),
    [talentOrder],
  );

  useEffect(() => {
    if (!talentOrderId && talentOrderOptions[0]) {
      setTalentOrderId(talentOrderOptions[0].value);
    }
  }, [talentOrderId, talentOrderOptions]);

  const playersOptions = useMemo(
    () => (playerSource === "talentOrder" ? playersByTalentOrder : players),
    [playerSource, playersByTalentOrder, players],
  );

  const teamsById = useMemo(() => {
    const map = new Map<string, TeamType>();
    teams.forEach((team) => map.set(String(team.id), team));
    return map;
  }, [teams]);

  const clubOptions = useMemo(() => buildClubOptions(teams), [teams]);

  const selectedUniques = useMemo(() => selectedPickUniques(lanes), [lanes]);
  const selectedPlayers = useMemo(() => selectedPlayerIds(lanes), [lanes]);

  const groupedPicks = useMemo(
    () =>
      groupTradePicks({
        picks: allDraftPicks,
        teamsById,
        selectedUniques,
      }),
    [allDraftPicks, teamsById, selectedUniques],
  );

  const payload = useMemo(
    () =>
      buildTradeRequestPayload(
        lanes.map((lane) => ({
          teamId: lane.teamId,
          picksIn: lane.picksIn.map((pick) => ({
            unique: pick.unique,
            label: pick.label,
          })),
          playersIn: lane.playersIn,
        })),
      ),
    [lanes],
  );

  const readyToPreview = isTradeReadyToPreview(lanes);

  const impactQuery = useGetTradeImpact({
    projectId,
    payload,
    enabled: isOpen && readyToPreview,
  });

  const createTrade = useCreateTrade();

  useEffect(() => {
    setCommitImpact(null);
  }, [payload]);

  const ptsInByLane = useMemo(
    () =>
      Object.fromEntries(
        lanes.map((lane) => [lane.id, sumLanePickPoints(lane.picksIn)]),
      ),
    [lanes],
  );
  const impactData = commitImpact ?? (readyToPreview ? impactQuery.data : null);
  const impactLoading = readyToPreview && impactQuery.isFetching && !commitImpact;
  const impactErrorMessage = impactQuery.error
    ? getErrorMessage(impactQuery.error, "Failed to load trade preview")
    : null;

  const clubCount = new Set(lanes.map((lane) => lane.teamId).filter(Boolean))
    .size;
  const hasAsset = lanes.some(
    (lane) => lane.picksIn.length > 0 || lane.playersIn.length > 0,
  );
  const canConfirm =
    clubCount >= 2 &&
    hasAsset &&
    readyToPreview &&
    !impactLoading &&
    !impactQuery.error &&
    Boolean(impactData) &&
    impactData?.summaryValidity !== "Invalid";

  const resetState = useCallback(() => {
    setLanes(createDefaultLanes());
    setPlayerSource("all");
    setTalentOrderId("");
    setCommitImpact(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const addClub = () => {
    setLanes((prev) => [...prev, createEmptyLane()]);
  };

  const removeClub = (laneId: string) => {
    setLanes((prev) =>
      prev.length <= 2 ? prev : prev.filter((lane) => lane.id !== laneId),
    );
  };

  const setClub = (laneId: string, teamId: string) => {
    setLanes((prev) =>
      prev.map((lane) => (lane.id === laneId ? { ...lane, teamId } : lane)),
    );
  };

  const addPick = (laneId: string, pick: DraftPicksDataType) => {
    setLanes((prev) => addPickToLane(prev, laneId, pick));
  };

  const removePick = (laneId: string, unique: string) => {
    setLanes((prev) =>
      prev.map((lane) =>
        lane.id === laneId
          ? {
              ...lane,
              picksIn: lane.picksIn.filter((pick) => pick.unique !== unique),
            }
          : lane,
      ),
    );
  };

  const addPlayer = (laneId: string, player: PlayerDatabaseType) => {
    const nextPlayer: TradeLanePlayer = toLanePlayer(player);
    setLanes((prev) => addPlayerToLane(prev, laneId, nextPlayer));
  };

  const handleSetPlayerSource = (source: PlayerSource) => {
    setPlayerSource(source);
  };

  const handleTalentOrderChange = (value: string) => {
    setTalentOrderId(value);
    setPlayerSource("talentOrder");
  };

  const setPlayerFromClub = (
    laneId: string,
    playerId: string,
    fromTeamId: string,
  ) => {
    setLanes((prev) =>
      prev.map((lane) =>
        lane.id === laneId
          ? {
              ...lane,
              playersIn: lane.playersIn.map((player) =>
                player.playerId === playerId
                  ? { ...player, fromTeamId }
                  : player,
              ),
            }
          : lane,
      ),
    );
  };

  const removePlayer = (laneId: string, playerId: string) => {
    setLanes((prev) =>
      prev.map((lane) =>
        lane.id === laneId
          ? {
              ...lane,
              playersIn: lane.playersIn.filter(
                (player) => player.playerId !== playerId,
              ),
            }
          : lane,
      ),
    );
  };

  const handleConfirm = () => {
    if (!canConfirm) return;

    createTrade.mutate(
      { projectId, payload },
      {
        onSuccess: (result) => {
          if (result.kind === "blocked") {
            setCommitImpact(result.impact);
            return;
          }
          toast.success(
            result.transactionDescription || "Trade completed successfully",
          );
          promptSaveToCsv({
            transactionType: "Trade",
            payload,
          });
          handleClose();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Failed to confirm trade"));
        },
      },
    );
  };

  return {
    selectedProject,
    lanes,
    clubOptions,
    teamsById,
    teamsLoading,
    groupedPicks,
    picksLoading,
    selectedUniques,
    selectedPlayers,
    playerSource,
    setPlayerSource: handleSetPlayerSource,
    talentOrderId,
    talentOrderOptions,
    playersOptions,
    onTalentOrderChange: handleTalentOrderChange,
    ptsInByLane,
    impactData,
    impactLoading,
    impactError: impactErrorMessage,
    canConfirm,
    isSubmitting: createTrade.isPending,
    readyToPreview,
    addClub,
    removeClub,
    setClub,
    addPick,
    removePick,
    addPlayer,
    setPlayerFromClub,
    removePlayer,
    handleConfirm,
    handleClose,
  };
};
