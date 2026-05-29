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

export type TabOptionType = {
  label: string;
  value: string;
  toHide?: boolean;
};
