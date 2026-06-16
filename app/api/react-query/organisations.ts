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
  OrgDetailsType,
  OrgMembersListType,
  UpdateOrganisationType,
} from "../type/organisation";
import { ORG_MEMBERS, ORGLIST } from "../dummy/org-list";

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
const transformOrgDetailsData = (data: any): OrgDetailsType => {
  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    defaultTeam: {
      id: data.default_team.id,
      name: data.default_team.name,
      shortName: data.default_team.short_name,
    },
    sportingCode: {
      code: data.sporting_code.code,
      name: data.sporting_code.name,
    },
  };
};
export const useGetOrgDetails = (id: string) => {
  return useQuery({
    queryKey: ["organisations", id],
    queryFn: async () => {
      // const { data } = await apiClient.get(getOrganisactionDetailsApiUrl(id));
      const data = ORGLIST.find((item) => item.id.toString() === id.toString());
      return transformOrgDetailsData(data);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

const transformOrgMembers = (data: any): OrgMembersListType[] => {
  if (!data) {
    return [];
  }
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    tier: item.tier,
  }));
};
export const useGetOrgMembers = (id: string) => {
  return useQuery({
    queryKey: ["organisations", id, "members"],
    queryFn: async () => {
      // const { data } = await apiClient.get(getOrganisactionMembersApiUrl(id));
      return transformOrgMembers(ORG_MEMBERS);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
