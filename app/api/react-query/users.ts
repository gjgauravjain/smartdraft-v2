import apiClient from "@/lib/api-client";
import {
  deleteUserApiUrl,
  getAllUsersApiUrl,
  linkOrganisationApiUrl,
  registerUserApiUrl,
  unlinkOrganisationApiUrl,
  updateUserApiUrl,
} from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUserType, UpdateUserType } from "../type/user";
import { transformAllUsers, transformCreateUserPayload } from "../util/user";

export const useGetAllUsers = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      const { data } = await apiClient.get(getAllUsersApiUrl());
      return transformAllUsers(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

const invalidateUsers = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["users", "all"] });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserType) => {
      const { data: user } = await apiClient.post(
        registerUserApiUrl(),
        transformCreateUserPayload(payload),
      );

      const userId = user.id.toString();

      if (payload.organisationIds.length > 0) {
        await Promise.all(
          payload.organisationIds.map((orgId) =>
            apiClient.post(linkOrganisationApiUrl(orgId, userId), {
              roles: [],
            }),
          ),
        );
      }
      return user;
    },
    onSuccess: () => invalidateUsers(queryClient),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateUserType) => {
      const { data } = await apiClient.put(
        updateUserApiUrl(payload.id.toString()),
        {
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          team_id: Number(payload.defaultTeamId),
        },
      );
      return data;
    },
    onSuccess: () => invalidateUsers(queryClient),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await apiClient.delete(
        deleteUserApiUrl(userId.toString()),
      );
      return data;
    },
    onSuccess: () => invalidateUsers(queryClient),
  });
};

export const useUnlinkUserFromOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orgId,
      userId,
    }: {
      orgId: string;
      userId: number;
    }) => {
      const { data } = await apiClient.delete(
        unlinkOrganisationApiUrl(orgId, userId.toString()),
      );
      return data;
    },
    onSuccess: () => invalidateUsers(queryClient),
  });
};

export const useLinkUserToOrganisation = () => {
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
      const { data } = await apiClient.post(
        linkOrganisationApiUrl(orgId, userId.toString()),
        { roles },
      );
      return data;
    },
    onSuccess: () => invalidateUsers(queryClient),
  });
};
