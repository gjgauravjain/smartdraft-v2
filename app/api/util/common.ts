import { TeamType, UserDetailsType } from "../type/common";

export const transformTeamsData = (data: any[]): TeamType[] => {
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

export const transformUserDetails = (data: any): UserDetailsType => {
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
