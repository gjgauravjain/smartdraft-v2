import { ProjectType } from "@/app/api/type/projects";
import {
  ArrowLeftRight,
  Users,
  ListOrdered,
  UserPlus,
  BadgeCheck,
  GraduationCap,
  UsersRound,
  Globe,
  ClipboardList,
  Pencil,
  SkipForward,
  LogIn,
} from "lucide-react";

export const PAST_YEAR_THRESHOLD = new Date().getFullYear() - 1;

export const isPastSeason = (project: ProjectType): boolean => {
  const yr = parseInt(project.year, 10);
  return !isNaN(yr) && yr < PAST_YEAR_THRESHOLD;
};

export const TRANSACTION_MENU_OPTIONS = [
  {
    id: "transaction_1",
    value: "completed_trade",
    label: "Completed Trade",
    icon: <ArrowLeftRight />,
  },
  {
    id: "transaction_completed_trade",
    value: "multi_completed_trade",
    label: "Multi Team Trade",
    icon: <Users />,
  },
  {
    id: "transaction_2",
    value: "priority_pick",
    label: "Priority Pick",
    icon: <ListOrdered />,
  },
  {
    id: "transaction_3",
    value: "free_agent_compensation",
    label: "Free Agent Compensation",
    icon: <UserPlus />,
  },
  {
    id: "transaction_apply_compensation",
    value: "apply_compensation",
    label: "Apply Compensation",
    icon: <BadgeCheck />,
  },
  {
    id: "transaction_4",
    value: "academy_bid_match",
    label: "Academy Bid Match",
    icon: <GraduationCap />,
  },
  {
    id: "transaction_5",
    value: "father_son_bid_match",
    label: "Father Son Bid Match",
    icon: <UsersRound />,
  },
  {
    id: "transaction_6",
    value: "nga_bid_match",
    label: "NGA Bid Match",
    icon: <Globe />,
  },
  {
    id: "transaction_9",
    value: "draft_night_selection",
    label: "Draft Night Selection",
    icon: <ClipboardList />,
  },
  {
    id: "transaction_10",
    value: "manual_pick_edit",
    label: "Manual Pick Edit",
    icon: <Pencil />,
  },
  {
    id: "transaction_12",
    value: "pass_picks",
    label: "Pass Picks",
    icon: <SkipForward />,
  },
  {
    id: "transaction_11",
    value: "delete_unusable_picks",
    label: "Enter Draft Mode",
    icon: <LogIn />,
  },
] as const;
