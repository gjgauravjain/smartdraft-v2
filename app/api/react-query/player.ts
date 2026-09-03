import apiClient from "@/lib/api-client";
import {
  fetchRankingListApiUrl,
  fetchRankingListDataApiUrl,
  getOrganisationPlayerListApiUrl,
  getOrganisationPlayersLookupApiUrl,
} from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import {
  transformPlayerList,
  transformPlayerLookup,
  transformRankingList,
} from "../util/player";

export const useGetPlayerList = ({ orgId }: { orgId: string }) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["playerList", orgId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        getOrganisationPlayerListApiUrl(orgId),
      );
      return transformPlayerList(data);
    },
    enabled: !!accessToken && !!orgId,
  });
};

export const useGetTalentOrder = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["talentOrder"],
    queryFn: async () => {
      const { data } = await apiClient.get(fetchRankingListApiUrl());
      return transformRankingList(data);
    },
    enabled: !!accessToken,
  });
};

export const useGetPlayersLookup = ({
  orgId,
  q,
  enabled = true,
}: {
  orgId: string;
  q: string;
  enabled?: boolean;
}) => {
  const { accessToken } = useAuth();
  const search = q.trim();

  return useQuery({
    queryKey: ["player-lookup", orgId, search],
    queryFn: async () => {
      const { data } = await apiClient.get(
        getOrganisationPlayersLookupApiUrl(orgId, search),
      );
      return transformPlayerLookup(data);
    },
    enabled: !!accessToken && !!orgId && !!search && enabled,
    staleTime: 30 * 1000,
    retry: 0,
  });
};

export const useGetPlayerListByTalentOrder = ({
  talentOrder,
}: {
  talentOrder: string;
}) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["playerListByTalentOrder", talentOrder],
    queryFn: async () => {
      const { data } = await apiClient.get(
        fetchRankingListDataApiUrl(talentOrder),
      );
      const playersList = data.ranks.map((rank: any) => rank.player).flat();
      return transformPlayerList(playersList);
    },
    enabled: !!accessToken && !!talentOrder,
  });
};
