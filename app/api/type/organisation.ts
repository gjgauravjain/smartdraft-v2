type DefaultTeamType = {
  id: string;
  name: string;
  shortName: string;
};

type SportingCodeType = {
  code: string;
  name: string;
};

export type OrganisationListType = {
  id: string;
  name: string;
  defaultTeam: DefaultTeamType;
  sportingCode: SportingCodeType;
  createdAt: string;
  updatedAt: string;
};

export type NewOrganisationFormValues = {
  organisationName: string;
  sportingCode: string;
  defaultTeam: string;
};

export type AddOrganisationType = {
  name: string;
  defaultTeam: string;
  sportingCode: string;
};

export type UpdateOrganisationType = {
  id: string;
  name: string;
  defaultTeam: string;
  sportingCode: string;
};

export type OrgDetailsType = {
  id: string;
  name: string;
  logo: string | null;
  defaultTeam: DefaultTeamType;
  sportingCode: SportingCodeType;
  members?: number;
};

export type OrgMembersListType = {
  id: number;
  name: string;
  email: string;
  tier: string;
};
