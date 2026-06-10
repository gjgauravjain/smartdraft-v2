import apiClient from "@/lib/api-client";
import { getOrganisationListApiUrl } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { OrganisationListType } from "../type/organisation";


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
      } as OrganisationListType),
  );
};

export const useGetOrganisations = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["organisations"],
    queryFn: async () => {
      const { data } = await apiClient.get(
        getOrganisationListApiUrl(),
      );
      console.log("Org list response", data);
      return transformOrgData(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
