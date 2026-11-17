import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { TradeValidity } from "@/app/api/type/trade";

export type TradeLanePick = {
  unique: string;
  label: string;
  display: string;
  points: number | null;
  year: number;
  currentOwner: string;
};

export type TradeLanePlayer = {
  playerId: string;
  playerName: string;
  fromTeamId: string;
};

export type TradeLane = {
  id: string;
  teamId: string;
  picksIn: TradeLanePick[];
  playersIn: TradeLanePlayer[];
};

export type TradeTeamFormValues = {
  lanes: TradeLane[];
};

export type TradeAssetRow = {
  key: string;
  label: string;
  points: number | null;
};

export type TradeHandChipTone = "incoming" | "traded" | "future" | "held";

export type TradeHandChip = {
  key: string;
  label: string;
  tone: TradeHandChipTone;
};

export type TradeHandYearView = {
  year: number;
  points: number | null;
  chips: TradeHandChip[];
};

export type TradeHandView = {
  years: TradeHandYearView[];
  playersLine: string;
  tradedWithoutYear: TradeHandChip[];
};

export type TradeStatusModel =
  | { kind: "idle"; message: string }
  | { kind: "checking"; message: string }
  | { kind: "error"; message: string }
  | {
      kind: "result";
      validity: TradeValidity;
      message: string;
      picks: string[];
    };

export type TradePickerTab = "picks" | "players";

export type TradePickerYear = {
  year: number;
  future: boolean;
  picks: DraftPicksDataType[];
};

export type TradePickerClubGroups = {
  inTrade: TeamType[];
  other: TeamType[];
};

export type TradeAssetSectionTone = "in" | "out";
