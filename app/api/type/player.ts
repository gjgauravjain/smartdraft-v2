export type CurrentRosterAllocationType = {
  contractType: string;
  contractTypeDescription: string;
  endSeason: string;
  id: string;
  startSeason: string;
  teamId: string;
  listCategory1?: string;
  listCategory2?: string;
};

export type CurrentManagementAllocationType = {
  agentId: string;
  agentName: string;
  companyId: string;
  companyName: string;
  endDate: string;
  id: string;
  startDate: string;
};

export type PlayerElegibilityType = {
  id: number;
  season: number;
  eligibilityType: string;
  eligibilityStatus: string;
};

export type PlayerDatabaseType = {
  id: string;
  organisationId: string;
  firstName: string;
  preferredFirstName: string;
  lastName: string;
  preferredLastName: string;
  juniorTeam: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  position: string;
  secondaryPosition: string;
  state: string;
  preferredFoot: string;
  created: string;
  updated: string;
  currentRoasterAllocation?: CurrentRosterAllocationType;
  currentManagementAllocation?: CurrentManagementAllocationType;
  externalId: string;
  currentAflActive?: boolean;
  elegibility?: PlayerElegibilityType[];
  maxContractEndSeason?: number;
};

export type TalentStatus = "drafted" | "available";

export interface TalentOrderRow {
  id: string;
  rank: number;
  name: string;
  club: string;
  state: string | null;
  positionLabel: string;
  status: TalentStatus;
}

export type TalentFilter = "all" | "available" | "drafted";

export type RankingListType = {
  created: string;
  draftYear: string;
  id: number;
  name: string;
  updated: string;
  eligibilityType?: string;
  isDefault?: boolean;
};
