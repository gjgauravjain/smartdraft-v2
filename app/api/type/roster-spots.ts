export type RosterSpotApi = {
  team_id: number;
  year: number;
  roster_spots_available: number;
};

export type ListSpotsTeamRow = {
  teamId: number;
  spotsByYear: Record<number, number>;
};

export type ListSpotsGridData = {
  years: number[];
  rows: ListSpotsTeamRow[];
};
