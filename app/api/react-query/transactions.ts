import {
  createManualPickEditApi,
  createPassPickApiUrl,
  getTransactionsSum,
  passPickImpactApiUrl,
} from "@/lib/api-constant";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buildPassPickRequestPayload,
  transformPassPickImpactResponse,
} from "../util/pass-pick";
import { ManualPickEditReason } from "../type/manual-pick-edit";
import { PassPickPassType } from "../type/pass-pick";
import { buildManualPickEditRequestPayload } from "../util/manual-pick-edit";
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

type GetPassPickImpactParams = {
  projectId: number;
  pickId: string;
  passType: PassPickPassType;
};

export const useGetPassPickImpact = ({
  projectId,
  pickId,
  passType,
}: GetPassPickImpactParams) => {
  const { accessToken } = useAuth();
  const readyToFetch = Boolean(projectId && pickId && passType);

  return useQuery({
    queryKey: ["pass-pick-impact", projectId, pickId, passType],
    queryFn: async () => {
      const { data } = await apiClient.post(
        passPickImpactApiUrl(String(projectId)),
        buildPassPickRequestPayload({ pickId, passType }),
      );

      return transformPassPickImpactResponse(data);
    },
    enabled: !!accessToken && readyToFetch,
    retry: 0,
  });
};

export const useCreatePassPick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      pickId,
      passType,
    }: {
      projectId: number;
      pickId: string;
      passType: PassPickPassType;
    }) => {
      const { data } = await apiClient.post(
        createPassPickApiUrl(String(projectId)),
        buildPassPickRequestPayload({ pickId, passType }),
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
      queryClient.invalidateQueries({
        queryKey: ["pass-pick-impact", variables.projectId],
      });
    },
  });
};

export const useCreateManualPickEdit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      pickLabel,
      uniquePick,
      newOwnerId,
      viaOwnerId,
      reason,
    }: {
      projectId: number;
      pickLabel: string;
      uniquePick: string;
      newOwnerId: string;
      viaOwnerId?: string;
      reason: ManualPickEditReason;
    }) => {
      const { data } = await apiClient.post(
        createManualPickEditApi(String(projectId)),
        buildManualPickEditRequestPayload({
          pickLabel,
          uniquePick,
          newOwnerId,
          viaOwnerId,
          reason,
        }),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
    },
  });
};
