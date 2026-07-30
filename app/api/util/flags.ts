import { FlagTooltipType, YearPickDict } from "../type/flags";

const transformPickDict = (data: any): YearPickDict[] => {
  if (!data) {
    return [];
  }

  return data.map((item: any) => ({
    pick: item.pick,
    pickStatus: item.pick_status,
    pickDisplay: item?.pick_display || "",
    clubPickNumber: item?.club_pick_number,
  }));
};

export const transformFlagTooltip = (data: any): FlagTooltipType[] => {
  if (!data) {
    return [];
  }

  return data.map(
    (item: any, index: number) =>
      ({
        currentYear: item.current_year,
        currentYearPicks: item.current_year_picks,
        currentYearsPts: item.current_year_pts,
        currentYearPickDict: transformPickDict(item.current_year_picks_dict),
        nextYear: item.next_year,
        nextYearPicks: item.next_year_picks,
        nextYearPicksDict: transformPickDict(item.next_year_picks_dict),
        nextYersPts: item.next_year_pts,
        picksUsed: item.picks_used,
        teamId: item.team_id,
        teamName: item.team_name,
        id: index + 1,
        currentYearPtsDiff: item.current_year_pts_diff,
        currentYearPtsRemaining: item.current_year_pts_remaining,
        nextYearPtsDiff: item.next_year_pts_diff,
        nextYearPtsRemaining:
          item?.next_year_pts_remaining || item.nex_year_pts_remaining,
        currentYearPickRemaining: item.current_year_picks_remaining,
        currentYearRosterSpots: item.roster_spots_current_year,
        transactionNetResult: item.transaction_net_result,
        thirdYear: item.third_year,
        thirdYearPts: item.third_year_pts,
        thirdYearPtsDiff: item.third_year_pts_diff,
        thirdYearPicks: item.third_year_picks,
        thirdYearPicksDict: transformPickDict(item.third_year_picks_dict),
        thirdYearPtsRemaining: item.third_year_pts_remaining,
      }) as FlagTooltipType,
  );
};
