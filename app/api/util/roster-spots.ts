import {
  ListSpotsGridData,
  ListSpotsTeamRow,
  RosterSpotApi,
} from "../type/roster-spots";

export const LIST_SPOTS_MIN = 1;
export const LIST_SPOTS_MAX = 10;

export const clampListSpots = (value: number) =>
  Math.min(LIST_SPOTS_MAX, Math.max(LIST_SPOTS_MIN, value));

export const transformRosterSpotsResponse = (
  data: RosterSpotApi[],
): RosterSpotApi[] => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    team_id: item.team_id,
    year: item.year,
    roster_spots_available: clampListSpots(item.roster_spots_available),
  }));
};

export const transformFlatSpotsToGrid = (
  spots: RosterSpotApi[],
): ListSpotsGridData => {
  if (!spots.length) {
    return { years: [], rows: [] };
  }

  const years = Array.from(new Set(spots.map((spot) => spot.year))).sort(
    (a, b) => a - b,
  );

  const teamIds = Array.from(
    new Set(
      spots
        .filter((spot) => spot.year === years[0])
        .map((spot) => spot.team_id),
    ),
  );

  const rows: ListSpotsTeamRow[] = teamIds.map((teamId) => {
    const spotsByYear: Record<number, number> = {};

    years.forEach((year) => {
      const match = spots.find(
        (spot) => spot.team_id === teamId && spot.year === year,
      );
      spotsByYear[year] = match?.roster_spots_available ?? LIST_SPOTS_MIN;
    });

    return { teamId, spotsByYear };
  });

  return { years, rows };
};

export const transformGridToFlatSpots = (
  grid: ListSpotsGridData,
): RosterSpotApi[] => {
  const flat: RosterSpotApi[] = [];

  grid.rows.forEach((row) => {
    grid.years.forEach((year) => {
      flat.push({
        team_id: row.teamId,
        year,
        roster_spots_available: row.spotsByYear[year] ?? LIST_SPOTS_MIN,
      });
    });
  });

  return flat;
};

export const getChangedRosterSpots = (
  initial: RosterSpotApi[],
  current: RosterSpotApi[],
): RosterSpotApi[] => {
  return current.filter((spot) => {
    const original = initial.find(
      (item) => item.team_id === spot.team_id && item.year === spot.year,
    );

    return original?.roster_spots_available !== spot.roster_spots_available;
  });
};
