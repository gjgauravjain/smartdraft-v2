import { DraftPicksDataType } from "@/app/api/type/draftpicks";

export type TradeLanePick = {
  unique: string;
  label: string;
  points: number;
  overallPick: number;
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

export type GroupedTradePicks = {
  clubId: string;
  clubName: string;
  years: {
    year: number;
    picks: Array<DraftPicksDataType & { disabled: boolean }>;
  }[];
};
