import {
  deleteUnusablePicksApi,
  fetchRosterSpotsApiUrl,
  updateRosterSpotsApiUrl,
} from "@/lib/api-constant";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RosterSpotApi } from "../type/roster-spots";
import { transformRosterSpotsResponse } from "../util/roster-spots";

export const useFetchRosterSpots = ({
  projectId,
  enabled = true,
}: {
  projectId: number;
  enabled?: boolean;
}) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["roster-spots", projectId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        fetchRosterSpotsApiUrl(String(projectId)),
      );
      return transformRosterSpotsResponse(data);
    },
    enabled: !!accessToken && !!projectId && enabled,
    staleTime: 0,
    retry: 0,
  });
};

export const useUpdateRosterSpots = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      spots,
    }: {
      projectId: number;
      spots: RosterSpotApi[];
    }) => {
      const { data } = await apiClient.put(
        updateRosterSpotsApiUrl(String(projectId)),
        spots,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["roster-spots", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["flagTooltip", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["draftpicks", variables.projectId],
      });
    },
  });
};

export const useEnterDraftMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      const { data } = await apiClient.post(
        deleteUnusablePicksApi(String(projectId)),
        {},
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["draftpicks", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["flagTooltip", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["roster-spots", variables.projectId],
      });
    },
  });
};
