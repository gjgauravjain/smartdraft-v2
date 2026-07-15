import { getTransactionsSum } from "@/lib/api-constant";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { transformFatherSonBidImpactResponse } from "../util/transaction";

type GetFatherSonBidImpactParams = {
  projectId: number;
  fsTeamId: string;
  playerId: string;
  pickId: string;
};

export const useGetFatherSonBidImpact = ({
  projectId,
  fsTeamId,
  playerId,
  pickId,
}: GetFatherSonBidImpactParams) => {
  const { accessToken } = useAuth();

  const readyToFetch = Boolean(projectId && fsTeamId && playerId && pickId);

  return useQuery({
    queryKey: ["father-son-bid-impact", projectId, fsTeamId, playerId, pickId],

    queryFn: async () => {
      const { data } = await apiClient.post(getTransactionsSum(projectId), {
        fs_team: fsTeamId,
        pickid: pickId,
        playerid: playerId,
      });

      return transformFatherSonBidImpactResponse(data);
    },

    enabled: !!accessToken && readyToFetch,
    retry: 0,
  });
};
