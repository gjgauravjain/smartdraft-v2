export type UserOrganisationType = {
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
export type UserListType = {
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
  auth0Id: string | null;
  teamId: number;
  groups: string[];
  userPermissions: string[];
  organisations: UserOrganisationType[];
};

export type CreateUserType = {
  firstName: string;
  lastName: string;
  email: string;
  defaultTeamId: string;
  tierId: string;
  organisationIds: string[];
};

export type UpdateUserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  defaultTeamId: string;
};
