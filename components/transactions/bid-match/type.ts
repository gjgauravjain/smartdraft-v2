import { BidMatchKind } from "@/app/api/type/transaction";
import { Control } from "react-hook-form";

export type { BidMatchKind };

export type BidMatchFormValues = {
  teamId: string;
  playerId: string;
  pickId: string;
};

export type BidChipTone =
  | "used"
  | "slid"
  | "deficit"
  | "selection"
  | "held"
  | "future";

export type BidChip = {
  key: string;
  label: string;
  tone: BidChipTone;
  name?: string;
};

export type BidMatchBoxTone = "available" | "deficit" | "blocked";

export type BidMatchBoxRow = {
  key: string;
  label: string;
  chips: BidChip[];
  note: string;
};

export type BidMatchBox = {
  tone: BidMatchBoxTone;
  title: string;
  detail: string;
  rows: BidMatchBoxRow[];
  note: string;
};

export type BidCostTone = "plain" | "deficit" | "over" | "total";

export type BidCostRow = {
  key: string;
  label: string;
  detail: string;
  points: string;
  remaining: string;
  tone: BidCostTone;
};

export type BidHandYear = {
  year: string;
  points: string;
  chips: BidChip[];
};

export type BidMatchResult = {
  headline: string;
  basis: string;
  spots: string;
  box: BidMatchBox;
  cost: BidCostRow[];
  hand: BidHandYear[];
  legend: string[];
  compensation: string;
  canProceed: boolean;
};

export type BidMatchFieldsProps = {
  control: Control<BidMatchFormValues>;
  clubLabel: string;
  clubOptions: { label: string; value: string; icon?: string }[];
  playerOptions: { label: string; value: string }[];
  pickOptions: { label: string; value: string }[];
  clubsLoading: boolean;
  playersLoading: boolean;
  picksLoading: boolean;
};
