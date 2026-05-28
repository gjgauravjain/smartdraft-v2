import apiClient from "@/lib/api-client";
import { getFlagApiUrl, getUserInfo } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";

export type TeamType = {
  id: string;
  teamNames: string;
  shortName: string;
  image: string;
  listSpotsAvailable: number;
  indigenousName: string;
  fitzroyName: string;
  externalTeamId: string;
};

const transformTeamsData = (data: any[]): TeamType[] => {
  if (!data) {
    return [];
  }
  return data.map((team) => ({
    id: team.id.toString(),
    teamNames: team.TeamNames,
    shortName: team.ShortName,
    image: team.Image,
    listSpotsAvailable: team.ListSpotsAvailable,
    indigenousName: team.IndigenousName,
    fitzroyName: team.FitzroyName,
    externalTeamId: team.ExternalTeamId,
  }));
};

const fetchTeams = async () => {
  const { data } = await apiClient.get(getFlagApiUrl);
  return transformTeamsData(data.data);
};

export const useGetTeams = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export type OrganisationType = {
  organisationId: number;
  organisationTitle: string;
  organisationSportingCode: string;
  organisationDefaultTeamId: number;
  organisationDefaultTeamName: string;
  organisationDefaultTeamShortName: string;
  created: string;
  updated: string;
  invitationAccepted: boolean;
  roles: string[];
};

export type UserDetailsType = {
  id: number;
  lastLogin: string | null;
  isSuperuser: boolean;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
  uuid: string;
  username: string;
  email: string;
  active: string;
  auth0Id: string;
  teamId: number;
  groups: string[];
  userPermissions: string[];
  organisations: OrganisationType[];
};

const transformUserDetails = (data: any): UserDetailsType => {
  return {
    id: data.id,
    lastLogin: data.last_login,
    isSuperuser: data.is_superuser,
    firstName: data.first_name,
    lastName: data.last_name,
    isStaff: data.is_staff,
    isActive: data.is_active,
    dateJoined: data.date_joined,
    uuid: data.uuid,
    username: data.username,
    email: data.email,
    active: data.Active,
    auth0Id: data.auth0_id,
    teamId: data.Teams,
    groups: data.groups,
    userPermissions: data.user_permissions,
    organisations: data.organisations.map((org: any) => ({
      organisationId: org.organisation_id,
      organisationTitle: org.organisation_title,
      organisationSportingCode: org.organisation_sporting_code,
      organisationDefaultTeamId: org.organisation_default_team_id,
      organisationDefaultTeamName: org.organisation_default_team_name,
      organisationDefaultTeamShortName:
        org.organisation_default_team_short_name,
      created: org.created,
      updated: org.updated,
      invitationAccepted: org.invitation_accepted,
      roles: org.roles,
    })),
  };
};

export const useGetUserDetails = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const { data } = await apiClient.get(getUserInfo());
      return transformUserDetails(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
