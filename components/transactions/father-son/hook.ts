import { useGetTeams } from "@/app/api/react-query/common";
import { useGetAllDraftPicksList } from "@/app/api/react-query/draftpicks";
import {
  useGetPlayerList,
  useGetTalentOrder,
  useGetPlayerListByTalentOrder,
} from "@/app/api/react-query/player";
import { useGetFatherSonBidImpact } from "@/app/api/react-query/transactions";
import { useStore } from "@/store/useStore";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { TeamType } from "@/app/api/type/common";
import { PlayerDatabaseType } from "@/app/api/type/player";
import { parseRound } from "./util";

type TalentOrderOptionSource = {
  id: string | number;
  name: string;
  isDefault?: boolean;
};

type DraftPickOptionSource = {
  currentOwner: string | number;
  label: string;
  value: string | number;
  overallPick: string | number;
};

export type FatherSonBidMatchFormValues = {
  fsTeamId: string;
  playerSource: "all" | "talentOrder";
  talentOrderId: string;
  playerId: string;
  pickId: string;
};

export const useFatherSonBidMatchModal = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const { currentOrganisation, selectedProject } = useStore();
  const { data: teams } = useGetTeams();
  const { data: players, refetch: refetchPlayers } = useGetPlayerList({
    orgId: currentOrganisation || "",
  });
  const { data: talentOrder, refetch: refetchTalentOrders } =
    useGetTalentOrder();
  const { data: allDraftPicks } = useGetAllDraftPicksList({
    projectId: Number(selectedProject?.id || "0"),
  });

  const form = useForm<FatherSonBidMatchFormValues>({
    defaultValues: {
      fsTeamId: "",
      playerSource: "all",
      talentOrderId: "",
      playerId: "",
      pickId: "",
    },
  });

  const [
    fsTeamId = "",
    playerSource = "all",
    talentOrderId = "",
    playerId = "",
    pickId = "",
  ] = useWatch({
    control: form.control,
    name: ["fsTeamId", "playerSource", "talentOrderId", "playerId", "pickId"],
  });

  const { data: playersByTalentOrder } = useGetPlayerListByTalentOrder({
    talentOrder: talentOrderId,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void refetchTalentOrders();
    if (currentOrganisation) {
      void refetchPlayers();
    }
  }, [isOpen, currentOrganisation, refetchPlayers, refetchTalentOrders]);

  const teamsById = useMemo(() => {
    const map = new Map<string, TeamType>();
    (teams ?? []).forEach((team: TeamType) => map.set(String(team.id), team));
    return map;
  }, [teams]);

  const activePlayers = useMemo(
    () =>
      playerSource === "talentOrder"
        ? (playersByTalentOrder ?? [])
        : (players ?? []),
    [playerSource, playersByTalentOrder, players],
  );

  const selectedPlayer = useMemo(() => {
    const allPlayers = [...(players ?? []), ...(playersByTalentOrder ?? [])];
    return allPlayers.find(
      (player: PlayerDatabaseType) => String(player.id) === playerId,
    );
  }, [players, playersByTalentOrder, playerId]);

  const projectId = Number(selectedProject?.id || "0");
  const readyToFetch = Boolean(fsTeamId && playerId && pickId);

  const impactQuery = useGetFatherSonBidImpact({
    projectId,
    fsTeamId,
    playerId,
    pickId,
  });

  const apiImpact = impactQuery.data ?? null;

  const error = useMemo(() => {
    if (!impactQuery.error) return null;
    if (axios.isAxiosError(impactQuery.error)) {
      const status = impactQuery.error.response?.status;
      return status
        ? `Request failed (${status})`
        : impactQuery.error.message || "Something went wrong";
    }
    return impactQuery.error instanceof Error
      ? impactQuery.error.message
      : "Something went wrong";
  }, [impactQuery.error]);

  const loading = impactQuery.isFetching;

  const displayedImpact = apiImpact;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const bidTeam = displayedImpact
    ? teamsById.get(String(displayedImpact.bidTeam))
    : null;
  const fsTeam = fsTeamId ? teamsById.get(fsTeamId) : null;

  const teamsOptions: SelectOption[] = useMemo(
    () =>
      (teams ?? []).map(
        (team: TeamType) =>
          ({
            value: String(team.id),
            label: team.teamNames,
            icon: team.image,
          }) as SelectOption,
      ),
    [teams],
  );
  const allDraftPicksOptions: SelectOption[] = useMemo(
    () =>
      (allDraftPicks ?? []).map((pick: DraftPickOptionSource) => {
        const owner = teamsById.get(String(pick.currentOwner));
        const round = parseRound(pick.label);
        return {
          value: String(pick.value),
          label: `${round ? `RD${round} · ` : ""}Pick ${pick.overallPick}${
            owner ? ` · ${owner.teamNames}` : ""
          }`,
        } as SelectOption;
      }),
    [allDraftPicks, teamsById],
  );

  const talentOrderOptions: SelectOption[] = useMemo(
    () =>
      (talentOrder ?? []).map((order: TalentOrderOptionSource) => ({
        value: String(order.id),
        label: `${order.name}${order.isDefault ? " (Default)" : ""}`,
      })),
    [talentOrder],
  );

  const setPlayerSource = (source: "all" | "talentOrder") => {
    form.setValue("playerSource", source);
    form.setValue("playerId", "");
    if (source === "all") {
      form.setValue("talentOrderId", "");
    }
  };

  return {
    players,
    readyToFetch,
    selectedPlayer,
    allDraftPicks,
    playerSource,
    talentOrderId,
    bidTeam,
    displayedImpact,
    error,
    fsTeam,
    handleClose,
    loading,
    form,
    selectedProject,
    teamsOptions,
    talentOrderOptions,
    playersOptions: activePlayers,
    setPlayerSource,
    allDraftPicksOptions,
  };
};
