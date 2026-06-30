import { UserListType } from "../type/user";

export const transformAllUsers = (data: any[]): UserListType[] => {
  if (!data) {
    return [];
  }
  return data.map((user) => ({
    id: user.id,
    lastLogin: user.last_login,
    isSuperuser: user.is_superuser,
    firstName: user.first_name,
    lastName: user.last_name,
    isStaff: user.is_staff,
    isActive: user.is_active,
    dateJoined: user.date_joined,
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    active: user.Active,
    auth0Id: user.auth0_id,
    teamId: user.Teams,
    groups: user.groups,
    userPermissions: user.user_permissions,
    organisations: user.organisations.map((org: any) => ({
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
  }));
};

export const countUsersByOrganisation = (
  users: UserListType[],
): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const user of users) {
    for (const org of user.organisations) {
      counts[org.organisationId] = (counts[org.organisationId] ?? 0) + 1;
    }
  }
  return counts;
};
