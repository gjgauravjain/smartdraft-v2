import { ProjectType } from "@/app/api/type/projects";

export const PAST_YEAR_THRESHOLD = new Date().getFullYear() - 1;

export const isPastSeason = (project: ProjectType): boolean => {
  const yr = parseInt(project.year, 10);
  return !isNaN(yr) && yr < PAST_YEAR_THRESHOLD;
};

export const TRANSACTION_MENU_OPTIONS = [
  { id: "transaction_1", value: "completed_trade", label: "Completed Trade" },
  {
    id: "transaction_completed_trade",
    value: "multi_completed_trade",
    label: "Multi Team Trade",
  },
  { id: "transaction_2", value: "priority_pick", label: "Priority Pick" },
  {
    id: "transaction_3",
    value: "free_agent_compensation",
    label: "Free Agent Compensation",
  },
  {
    id: "transaction_apply_compensation",
    value: "apply_compensation",
    label: "Apply Compensation",
  },
  {
    id: "transaction_4",
    value: "academy_bid_match",
    label: "Academy Bid Match",
  },
  {
    id: "transaction_5",
    value: "father_son_bid_match",
    label: "Father Son Bid Match",
  },
  { id: "transaction_6", value: "nga_bid_match", label: "NGA Bid Match" },
  {
    id: "transaction_9",
    value: "draft_night_selection",
    label: "Draft Night Selection",
  },
  {
    id: "transaction_10",
    value: "manual_pick_edit",
    label: "Manual Pick Edit",
  },
  { id: "transaction_12", value: "pass_picks", label: "Pass Picks" },
  {
    id: "transaction_11",
    value: "delete_unusable_picks",
    label: "Enter Draft Mode",
  },
] as const;
