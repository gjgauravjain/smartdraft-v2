import apiClient from "@/lib/api-client";
import {
  fetchRankingListApiUrl,
  fetchRankingListDataApiUrl,
  getOrganisationPlayerListApiUrl,
} from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { transformPlayerList, transformRankingList } from "../util/player";

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
