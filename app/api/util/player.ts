import {
  DraftPoolPlayer,
  PlayerDatabaseType,
  PlayerLookupType,
  ProjectPlayer,
  RankingListType,
} from "../type/player";

export const transformPlayerDetail = (data: any): PlayerDatabaseType => {
  return {
    created: data.created,
    dateOfBirth: data.date_of_birth,
    firstName: data.first_name,
    height: data.height,
    id: data.id,
    juniorTeam: data.junior_team,
    lastName: data.last_name,
    organisationId: data.organisation_id,
    position: data.position,
    preferredFirstName: data.preferred_first_name,
    preferredFoot: data.preferred_foot,
    preferredLastName: data.preferred_last_name,
    secondaryPosition: data.secondary_position,
    state: data.state,
    updated: data.updated,
    weight: data.weight,
    externalId: data.external_id,
    currentAflActive: data.current_afl_active,
    elegibility:
      data?.eligibility?.map((item: any) => ({
        id: item.id,
        season: item.season,
        eligibilityType: item.eligibility_type,
        eligibilityStatus: item.eligibility_status,
      })) || [],
    currentManagementAllocation: data.current_management_allocation
      ? {
          agentId: data.current_management_allocation.agent_id,
          endDate: data.current_management_allocation.end_date,
          startDate: data.current_management_allocation.start_date,
          agentName: data.current_management_allocation.agent_name,
          companyId: data.current_management_allocation.company_id,
          companyName: data.current_management_allocation.company_name,
          id: data.current_management_allocation.id,
        }
      : undefined,
    currentRoasterAllocation: data.current_roster_allocation
      ? {
          contractType: data.current_roster_allocation.contract_type,
          contractTypeDescription:
            data.current_roster_allocation.contract_type_description,
          endSeason: data.current_roster_allocation.end_season,
          id: data.current_roster_allocation.id,
          startSeason: data.current_roster_allocation.start_season,
          teamId: data.current_roster_allocation.team_id,
          listCategory1: data.current_roster_allocation.list_category_1,
          listCategory2: data.current_roster_allocation.list_category_2,
        }
      : undefined,
  };
};
export const transformPlayerList = (data: any): PlayerDatabaseType[] => {
  if (!data) {
    return [];
  }

  return data.map((playerInfo: any) => transformPlayerDetail(playerInfo));
};

export const transformRankingList = (data: any): RankingListType[] => {
  if (!data) {
    return [];
  }

  return data.map(
    (item: any) =>
      ({
        created: item.created,
        draftYear: item.draft_year,
        id: item.id,
        name: item.name,
        updated: item.updated,
        eligibilityType: item.eligibility_type,
        isDefault: item.is_default,
      }) as RankingListType,
  );
};

const draftPoolList = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const record = data as { data?: unknown; results?: unknown };
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.results)) return record.results;
  return [];
};

const draftPoolRank = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
};

const draftPoolPosition = (value: unknown) => {
  if (typeof value !== "string") return null;
  const position = value.trim();
  if (!position) return null;
  return value;
};

export const transformDraftPool = (data: unknown): DraftPoolPlayer[] =>
  draftPoolList(data).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as {
      id?: unknown;
      display_name?: unknown;
      position?: unknown;
      rank?: unknown;
    };
    const id = typeof row.id === "number" ? row.id : Number(row.id);
    if (!Number.isInteger(id)) return [];
    if (typeof row.display_name !== "string" || !row.display_name.trim()) {
      return [];
    }
    return [
      {
        id,
        displayName: row.display_name,
        position: draftPoolPosition(row.position),
        rank: draftPoolRank(row.rank),
      },
    ];
  });

type ProjectPlayerApi = {
  id: number;
  FirstName: string;
  LastName: string;
  Full_Name: string;
  Height: string;
  Weight: string;
  club: string;
  State: string;
  Position_1: string;
  Position_2: string;
  Rank: string;
  Tier: string;
  Notes: string;
  projectId: number;
  Selected: boolean;
  Drafted_Team: number;
  Drafted_Team_Name: string;
};

const transformProjectPlayer = (item: ProjectPlayerApi): ProjectPlayer => ({
  id: item.id,
  firstName: item.FirstName,
  lastName: item.LastName,
  fullName: item.Full_Name,
  height: item.Height,
  weight: item.Weight,
  club: item.club,
  state: item.State,
  position1: item.Position_1,
  position2: item.Position_2,
  rank: item.Rank,
  tier: item.Tier,
  notes: item.Notes,
  projectId: item.projectId,
  selected: item.Selected,
  draftedTeam: item.Drafted_Team,
  draftedTeamName: item.Drafted_Team_Name,
});

export const transformProjectPlayers = (
  data: ProjectPlayerApi[],
): ProjectPlayer[] =>
  data
    .filter((item) => !item.Selected)
    .map(transformProjectPlayer)
    .sort((left, right) => left.fullName.localeCompare(right.fullName));

export const transformPlayerLookup = (data: any): PlayerLookupType[] => {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return list.map((item: any) => ({
    playerId: String(item?.player_id ?? ""),
    name: item?.name ?? "",
    teamId:
      item?.team_id === null || item?.team_id === undefined
        ? null
        : String(item.team_id),
  }));
};
