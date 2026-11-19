import {
  DraftHandPick,
  FatherSonBidImpactResponse,
  ImpactVisualType,
  OverallImpactItem,
} from "../type/transaction";

type RawHand = {
  Overall_Pick?: string | number;
  Pick_Status?: string;
  Year?: string | number;
  Draft_Round_Int?: string | number;
  Year_Type?: "Current" | "Next";
  Pick_Points?: number;
  Original_Owner?: number;
  Match_Role?: string | null;
  display?: string | null;
  Deficit_New_Pick?: boolean;
};

type RawDeficitImpact = {
  Year?: string[];
  Overall_Pick?: number[];
  Draft_Round_Int?: number[];
  AFL_Points_Value?: number[];
  Max_Deficit_Points?: number[];
  points_remaining?: number[];
  points_subtracted?: number[];
  new_overall_pick?: number[];
};

type RawVisual = {
  first_value?: number | string | null;
  first_value_tooltip?: string | null;
  points_remaining?: number | string;
  prefix?: string | null;
  second_value?: number | string | null;
  summary?: string;
  deficit_summary?: string;
  deficit_warning?: string;
  deficit_year?: number;
  points_deficit?: number;
  deficit_exceeds_cap?: boolean;
  allowable_deficit_points?: number;
  missing_next_year_first_rounder?: boolean;
  display?: string | null;
  deficit_impact?: RawDeficitImpact;
};

type RawOverall = {
  Overall_Pick?: string;
  AFL_Points_Value?: string;
  Display_Name_Detailed?: string;
  Cumulative_Pts?: number;
  Payoff_Diff?: string;
  AFL_Pts_Left?: number;
  Action?: string;
  Deficit_Amount?: string;
  new_pick_no?: number;
  new_rd_no?: number;
  picks_shuffled_points_value?: number;
  new_pick_pts_value?: number;
};

type RawCompensation = {
  team_id?: number;
  team_name?: string;
  finishing_position?: number;
  slide_spots?: number;
  r1_pick_used?: boolean;
  status?: string;
  insert_relative_to_r2?: string;
};

type RawBidImpact = {
  fs_team?: number;
  academy_team?: number;
  nga_team?: number;
  playerid?: string;
  bid_team?: number;
  bid_pick_no?: string;
  bid_summary?: string;
  bid_summary_2?: string;
  points_required?: number;
  listspotsavailable?: number;
  picksused?: number;
  picks_available?: number;
  draftsurplus?: number;
  overall_impact_dict?: RawOverall[];
  initial_draft_hand?: RawHand[];
  new_draft_hand?: RawHand[];
  overall_impact_visual?: RawVisual[];
  compensation_picks_2026?: RawCompensation[];
  can_proceed?: boolean;
  display_state?: string | null;
  hand_points?: {
    before?: Record<string, number>;
    after?: Record<string, number>;
  };
  max_picks_to_match?: number;
  committed_deficit_points?: number;
  points_basis?: string | null;
  block_reason?: string | null;
  match_note?: string | null;
  deficit_pick_note?: string | null;
};

const asArray = <T>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const textOrNull = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : null;

const mapHand = (item: RawHand): DraftHandPick => ({
  overallPick: item.Overall_Pick ?? "",
  pickStatus: item.Pick_Status ?? "",
  year: item.Year ?? "",
  draftRoundInt: item.Draft_Round_Int ?? "",
  yearType: item.Year_Type === "Next" ? "Next" : "Current",
  pickPoints: item.Pick_Points,
  originalOwner: item.Original_Owner,
  matchRole: item.Match_Role ?? null,
  display: textOrNull(item.display),
  deficitNewPick: Boolean(item.Deficit_New_Pick),
});

const mapOverall = (item: RawOverall): OverallImpactItem => ({
  overallPick: item.Overall_Pick ?? "",
  aflPointsValue: item.AFL_Points_Value ?? "",
  displayNameDetailed: item.Display_Name_Detailed ?? "",
  cumulativePts: item.Cumulative_Pts ?? 0,
  payoffDiff: item.Payoff_Diff ?? "",
  aflPtsLeft: item.AFL_Pts_Left ?? 0,
  action: item.Action ?? "",
  deficitAmount: item.Deficit_Amount ?? "",
  newPickNo: item.new_pick_no,
  newRdNo: item.new_rd_no,
  picksShuffledPointsValue: item.picks_shuffled_points_value,
  newPickPtsValue: item.new_pick_pts_value,
});

const mapVisual = (item: RawVisual): ImpactVisualType => ({
  firstValue: item.first_value ?? null,
  firstValueTooltip: item.first_value_tooltip ?? null,
  pointsRemaining: item.points_remaining ?? "",
  prefix: item.prefix ?? null,
  secondValue: item.second_value ?? null,
  summary: item.summary ?? "",
  deficitSummary: item.deficit_summary,
  deficitWarning: item.deficit_warning,
  deficitYear: item.deficit_year,
  pointsDeficit: item.points_deficit,
  deficitExceedsCap: item.deficit_exceeds_cap,
  allowableDeficitPoints: item.allowable_deficit_points,
  missingNextYearFirstRounder: item.missing_next_year_first_rounder,
  display: textOrNull(item.display),
  deficitImpact: item.deficit_impact
    ? {
        year: item.deficit_impact.Year ?? [],
        overallPick: item.deficit_impact.Overall_Pick ?? [],
        draftRoundInt: item.deficit_impact.Draft_Round_Int ?? [],
        aflPointsValue: item.deficit_impact.AFL_Points_Value ?? [],
        maxDeficitPoints: item.deficit_impact.Max_Deficit_Points ?? [],
        pointsRemaining: item.deficit_impact.points_remaining ?? [],
        pointsSubtracted: item.deficit_impact.points_subtracted ?? [],
        newOverallPick: item.deficit_impact.new_overall_pick ?? [],
      }
    : undefined,
});

export const transformFatherSonBidImpactResponse = (
  response: RawBidImpact,
): FatherSonBidImpactResponse => {
  return {
    fsTeam:
      response.fs_team ?? response.academy_team ?? response.nga_team ?? 0,
    playerId: response.playerid ?? "",
    bidTeam: response.bid_team ?? 0,
    bidPickNo: response.bid_pick_no ?? "",
    bidSummary: response.bid_summary ?? "",
    bidSummary2: response.bid_summary_2 ?? "",
    pointsRequired: response.points_required ?? 0,
    listSpotsAvailable: response.listspotsavailable ?? 0,
    picksUsed: response.picksused ?? 0,
    picksAvailable: response.picks_available ?? 0,
    draftSurplus: response.draftsurplus ?? 0,
    overallImpactDict: asArray(response.overall_impact_dict).map(mapOverall),
    initialDraftHand: asArray(response.initial_draft_hand).map(mapHand),
    newDraftHand: asArray(response.new_draft_hand).map(mapHand),
    overallImpactVisual: asArray(response.overall_impact_visual).map(mapVisual),
    compensationPicks2026: asArray(response.compensation_picks_2026).map(
      (item) => ({
        teamId: item.team_id ?? 0,
        teamName: item.team_name ?? "",
        finishingPosition: item.finishing_position ?? 0,
        slideSpots: item.slide_spots ?? 0,
        r1PickUsed: Boolean(item.r1_pick_used),
        status: item.status ?? "",
        insertRelativeToR2: item.insert_relative_to_r2 ?? "",
      }),
    ),
    canProceed: Boolean(response.can_proceed),
    displayState: response.display_state ?? "",
    handPoints: response.hand_points
      ? {
          before: response.hand_points.before ?? {},
          after: response.hand_points.after ?? {},
        }
      : undefined,
    maxPicksToMatch:
      typeof response.max_picks_to_match === "number"
        ? response.max_picks_to_match
        : undefined,
    committedDeficitPoints:
      typeof response.committed_deficit_points === "number"
        ? response.committed_deficit_points
        : undefined,
    pointsBasis: textOrNull(response.points_basis),
    blockReason: textOrNull(response.block_reason),
    matchNote: textOrNull(response.match_note),
    deficitPickNote: textOrNull(response.deficit_pick_note),
  };
};
