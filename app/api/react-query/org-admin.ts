import apiClient from "@/lib/api-client";
import {
  getOrganisationUsersApiUrl,
  unlinkOrganisationApiUrl,
  updateOrganisationUserRelationshipApiUrl,
} from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformOrgMembers } from "../util/org-admin";

export const useGetOrgMembers = (orgId: string, enabled = true) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["orgMembers", orgId],
    queryFn: async () => {
      const { data } = await apiClient.get(getOrganisationUsersApiUrl(orgId));
      return transformOrgMembers(data);
    },
    enabled: !!accessToken && !!orgId && enabled,
    staleTime: 60 * 1000,
    retry: 0,
  });
};

export const useUpdateOrgMemberRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      userId,
      roles,
    }: {
      orgId: string;
      userId: number;
      roles: string[];
    }) => {
      const { data } = await apiClient.put(
        updateOrganisationUserRelationshipApiUrl(orgId, userId.toString()),
        { roles },
      );
      return data;
    },
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ["orgMembers", orgId] });
    },
  });
};

export const useRemoveOrgMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      userId,
    }: {
      orgId: string;
      userId: number;
    }) => {
      await apiClient.delete(
        unlinkOrganisationApiUrl(orgId, userId.toString()),
      );
    },
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ["orgMembers", orgId] });
    },
  });
};
