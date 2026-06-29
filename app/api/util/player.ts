import { PlayerDatabaseType, RankingListType } from "../type/player";

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
