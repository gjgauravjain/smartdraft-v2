import { UserDetailsType } from "@/app/api/type/common";
import { ProjectType } from "@/app/api/type/projects";
import { hasRebuildDraftEditCapability } from "@/lib/capabilities";
import {
  ArrowLeftRight,
  ListOrdered,
  UserPlus,
  BadgeCheck,
  GraduationCap,
  UsersRound,
  Globe,
  ClipboardList,
  Pencil,
  ArrowUpDown,
  SkipForward,
  LogIn,
} from "lucide-react";

export const PAST_YEAR_THRESHOLD = new Date().getFullYear() - 1;

export const isPastSeason = (project: ProjectType): boolean => {
  const yr = parseInt(project.year, 10);
  return !isNaN(yr) && yr < PAST_YEAR_THRESHOLD;
};

export const TRANSACTION_MENU_OPTIONS_VALUE = {
  TRADE: "trade",
  COMPLETED_TRADE: "completed_trade",
  MULTI_COMPLETED_TRADE: "multi_completed_trade",
  PRIORITY_PICK: "priority_pick",
  FREE_AGENT_COMPENSATION: "free_agent_compensation",
  APPLY_COMPENSATION: "apply_compensation",
  ACADEMY_BID_MATCH: "academy_bid_match",
  FATHER_SON_BID_MATCH: "father_son_bid_match",
  NGA_BID_MATCH: "nga_bid_match",
  DRAFT_NIGHT_SELECTION: "draft_night_selection",
  MANUAL_PICK_EDIT: "manual_pick_edit",
  MOVE_PICK: "move_pick",
  PASS_PICKS: "pass_picks",
  DELETE_UNUSABLE_PICKS: "delete_unusable_picks",
} as const;
export const TRANSACTION_MENU_OPTIONS = [
  {
    id: "transaction_trade",
    value: TRANSACTION_MENU_OPTIONS_VALUE.TRADE,
    label: "Trade",
    icon: <ArrowLeftRight />,
  },
  {
    id: "transaction_2",
    value: TRANSACTION_MENU_OPTIONS_VALUE.PRIORITY_PICK,
    label: "Priority Pick",
    icon: <ListOrdered />,
  },
  {
    id: "transaction_3",
    value: TRANSACTION_MENU_OPTIONS_VALUE.FREE_AGENT_COMPENSATION,
    label: "Free Agent Compensation",
    icon: <UserPlus />,
  },
  {
    id: "transaction_apply_compensation",
    value: TRANSACTION_MENU_OPTIONS_VALUE.APPLY_COMPENSATION,
    label: "Apply Compensation",
    icon: <BadgeCheck />,
  },
  {
    id: "transaction_4",
    value: TRANSACTION_MENU_OPTIONS_VALUE.ACADEMY_BID_MATCH,
    label: "Academy Bid Match",
    icon: <GraduationCap />,
  },
  {
    id: "transaction_5",
    value: TRANSACTION_MENU_OPTIONS_VALUE.FATHER_SON_BID_MATCH,
    label: "Father Son Bid Match",
    icon: <UsersRound />,
  },
  {
    id: "transaction_6",
    value: TRANSACTION_MENU_OPTIONS_VALUE.NGA_BID_MATCH,
    label: "NGA Bid Match",
    icon: <Globe />,
  },
  {
    id: "transaction_9",
    value: TRANSACTION_MENU_OPTIONS_VALUE.DRAFT_NIGHT_SELECTION,
    label: "Draft Night Selection",
    icon: <ClipboardList />,
  },
  {
    id: "transaction_10",
    value: TRANSACTION_MENU_OPTIONS_VALUE.MANUAL_PICK_EDIT,
    label: "Manual Pick Edit",
    icon: <Pencil />,
  },
  {
    id: "transaction_move_pick",
    value: TRANSACTION_MENU_OPTIONS_VALUE.MOVE_PICK,
    label: "Move Pick",
    icon: <ArrowUpDown />,
  },
  {
    id: "transaction_12",
    value: TRANSACTION_MENU_OPTIONS_VALUE.PASS_PICKS,
    label: "Pass Picks",
    icon: <SkipForward />,
  },
  {
    id: "transaction_11",
    value: TRANSACTION_MENU_OPTIONS_VALUE.DELETE_UNUSABLE_PICKS,
    label: "Enter Draft Mode",
    icon: <LogIn />,
  },
] as const;

const DRAFT_EDIT_MENU_VALUES = new Set<string>([
  TRANSACTION_MENU_OPTIONS_VALUE.MANUAL_PICK_EDIT,
  TRANSACTION_MENU_OPTIONS_VALUE.MOVE_PICK,
  TRANSACTION_MENU_OPTIONS_VALUE.PASS_PICKS,
]);

export const getTransactionMenuOptions = (
  user: UserDetailsType | null | undefined,
) => {
  const hasDraftEdit = hasRebuildDraftEditCapability(user);

  return TRANSACTION_MENU_OPTIONS.filter((option) => {
    if (!DRAFT_EDIT_MENU_VALUES.has(option.value)) return true;
    return hasDraftEdit;
  });
};
