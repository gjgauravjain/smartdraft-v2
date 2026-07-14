import { DISPLAY_STATES } from "./util";

// export interface OverallImpactItem {
//   Overall_Pick: string;
//   AFL_Points_Value: string;
//   Display_Name_Detailed: string;
//   Cumulative_Pts: number;
//   Payoff_Diff: string;
//   AFL_Pts_Left: number;
//   Action: string;
//   Deficit_Amount: string;
//   new_pick_no?: number;
//   new_rd_no?: number;
//   picks_shuffled_points_value?: number;
//   new_pick_pts_value?: number;
// }

// export interface DraftHandPick {
//   Overall_Pick: string | number;
//   Pick_Status: string;
//   Year: string | number;
//   Draft_Round_Int: string | number;
//   Year_Type: "Current" | "Next";
// }

// export interface CompensationPick {
//   team_id: number;
//   team_name: string;
//   finishing_position: number;
//   slide_spots: number;
//   r1_pick_used: boolean;
//   status: string;
//   insert_relative_to_r2: string;
// }

// export interface FatherSonBidImpactResponse {
//   fs_team: number;
//   playerid: string;
//   bid_team: number;
//   bid_pick_no: string;
//   bid_summary: string;
//   bid_summary_2: string;
//   points_required: number;
//   listspotsavailable: number;
//   picksused: number;
//   picks_available: number;
//   draftsurplus: number;
//   overall_impact_dict: OverallImpactItem[];
//   initial_draft_hand: DraftHandPick[];
//   new_draft_hand: DraftHandPick[];
//   overall_impact_visual: unknown[];
//   compensation_picks_2026: CompensationPick[];
//   can_proceed: boolean;
//   display_state: string;
// }

export type DisplayStateKey = (typeof DISPLAY_STATES)[number]["key"];
