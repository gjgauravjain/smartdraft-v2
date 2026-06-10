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