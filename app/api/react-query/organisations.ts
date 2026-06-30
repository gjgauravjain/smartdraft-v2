import apiClient from "@/lib/api-client";
import {
  createOrganisationApiUrl,
  getOrganisationListApiUrl,
  updateOrganisationApiUrl,
} from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddOrganisationType,
  OrganisationListType,
  UpdateOrganisationType,
} from "../type/organisation";

export const transformOrgData = (data: any): OrganisationListType[] => {
  if (!data) {
    return [];
  }
  return data.map(
    (org: any) =>
      ({
        createdAt: org.created,
        defaultTeam: {
          id: org.default_team.id,
          name: org.default_team.name,
          shortName: org.default_team.short_name,
        },
        id: org.id,
        name: org.name,
        sportingCode: {
          code: org.sporting_code.code,
          name: org.sporting_code.name,
        },
        updatedAt: org.updated,
      }) as OrganisationListType,
  );
};

export const useGetOrganisations = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["organisations"],
    queryFn: async () => {
      const { data } = await apiClient.get(getOrganisationListApiUrl());
      return transformOrgData(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddOrganisationType) => {
      const { data } = await apiClient.post(createOrganisationApiUrl(), {
        sporting_code: payload.sportingCode,
        name: payload.name,
        default_team: payload.defaultTeam,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateOrganisationType) => {
      const { data } = await apiClient.put(
        updateOrganisationApiUrl(payload.id),
        {
          sporting_code: payload.sportingCode,
          name: payload.name,
          default_team: payload.defaultTeam,
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });
};
