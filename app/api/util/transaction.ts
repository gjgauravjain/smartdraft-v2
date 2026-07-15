import { FatherSonBidImpactResponse } from "../type/transaction";

export const transformFatherSonBidImpactResponse = (
  response: any,
): FatherSonBidImpactResponse => {
  return {
    fsTeam: response.fs_team,
    playerId: response.playerid,
    bidTeam: response.bid_team,
    bidPickNo: response.bid_pick_no,
    bidSummary: response.bid_summary,
    bidSummary2: response.bid_summary_2,
    pointsRequired: response.points_required,
    listSpotsAvailable: response.listspotsavailable,
    picksUsed: response.picksused,
    picksAvailable: response.picks_available,
    draftSurplus: response.draftsurplus,

    overallImpactDict: response.overall_impact_dict.map((item: any) => ({
      overallPick: item.Overall_Pick,
      aflPointsValue: item.AFL_Points_Value,
      displayNameDetailed: item.Display_Name_Detailed,
      cumulativePts: item.Cumulative_Pts,
      payoffDiff: item.Payoff_Diff,
      aflPtsLeft: item.AFL_Pts_Left,
      action: item.Action,
      deficitAmount: item.Deficit_Amount,
      newPickNo: item.new_pick_no,
      newRdNo: item.new_rd_no,
      picksShuffledPointsValue: item.picks_shuffled_points_value,
      newPickPtsValue: item.new_pick_pts_value,
    })),

    initialDraftHand: response.initial_draft_hand.map((item: any) => ({
      overallPick: item.Overall_Pick,
      pickStatus: item.Pick_Status,
      year: item.Year,
      draftRoundInt: item.Draft_Round_Int,
      yearType: item.Year_Type,
    })),

    newDraftHand: response.new_draft_hand.map((item: any) => ({
      overallPick: item.Overall_Pick,
      pickStatus: item.Pick_Status,
      year: item.Year,
      draftRoundInt: item.Draft_Round_Int,
      yearType: item.Year_Type,
    })),

    overallImpactVisual: response.overall_impact_visual.map((item: any) => ({
      firstValue: item.first_value,
      firstValueTooltip: item.first_value_tooltip,
      pointsRemaining: item.points_remaining,
      prefix: item.prefix,
      secondValue: item.second_value,
      summary: item.summary,

      deficitSummary: item.deficit_summary,
      deficitWarning: item.deficit_warning,
      deficitYear: item.deficit_year,
      pointsDeficit: item.points_deficit,

      deficitExceedsCap: item.deficit_exceeds_cap,
      allowableDeficitPoints: item.allowable_deficit_points,
      missingNextYearFirstRounder: item.missing_next_year_first_rounder,

      deficitImpact: item.deficit_impact
        ? {
            year: item.deficit_impact.Year,
            overallPick: item.deficit_impact.Overall_Pick,
            draftRoundInt: item.deficit_impact.Draft_Round_Int,
            aflPointsValue: item.deficit_impact.AFL_Points_Value,
            maxDeficitPoints: item.deficit_impact.Max_Deficit_Points,
            pointsRemaining: item.deficit_impact.points_remaining,
            pointsSubtracted: item.deficit_impact.points_subtracted,
            newOverallPick: item.deficit_impact.new_overall_pick,
          }
        : undefined,
    })),

    compensationPicks2026: (response?.compensation_picks_2026 || []).map(
      (item: any) => ({
        teamId: item.team_id,
        teamName: item.team_name,
        finishingPosition: item.finishing_position,
        slideSpots: item.slide_spots,
        r1PickUsed: item.r1_pick_used,
        status: item.status,
        insertRelativeToR2: item.insert_relative_to_r2,
      }),
    ),

    canProceed: response.can_proceed,
    displayState: response.display_state,
  };
};
