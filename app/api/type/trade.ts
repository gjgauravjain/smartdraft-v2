export type TradeValidity = "Valid" | "Warning" | "Invalid";
export type TradeCheckStatus = "Pass" | "Warning" | "Fail";

export type TradeRequestPick = {
  unique: string;
  label: string;
};

export type TradeRequestPlayer = {
  player_id: string;
  player_name: string;
  from_team_id: number;
};

export type TradeRequestTeam = {
  team_id: number;
  picks_in: TradeRequestPick[];
  players_in: TradeRequestPlayer[];
};

export type TradeRequestPayload = {
  teams: TradeRequestTeam[];
};

export type TradeHandPick = {
  pick: number;
  pickStatus: string;
  pickName: string;
  round: number;
  incoming: boolean;
};

export type TradeHandYear = {
  year: number;
  points: number;
  picks: TradeHandPick[];
};

export type TradeAssetPick = {
  unique: string;
  pickName: string;
  overallPick: number;
};

export type TradeAssetPlayer = {
  playerId: string;
  playerName: string;
};

export type TradeImpactTeam = {
  teamId: number;
  teamName: string;
  netResult: number;
  netResultEquivalentPick: number | null;
  ptsIn: number;
  ptsOut: number;
  picksIn: TradeAssetPick[];
  picksOut: TradeAssetPick[];
  playersIn: TradeAssetPlayer[];
  playersOut: TradeAssetPlayer[];
  handBefore: TradeHandYear[];
  handAfter: TradeHandYear[];
};

export type TradeValidityCheck = {
  status: TradeCheckStatus;
  description: string;
  picks: unknown[];
};

export type TradeValidityChecks = {
  tradeBackRule: TradeValidityCheck;
  pickExists: TradeValidityCheck;
  picksMatch: TradeValidityCheck;
};

export type TradeImpactResponse = {
  summaryDescription: string;
  summaryValidity: TradeValidity;
  teams: TradeImpactTeam[];
  validityChecks: TradeValidityChecks;
};

export type TradeCommitSuccess = {
  kind: "success";
  transactionDescription: string;
};

export type TradeCommitBlocked = {
  kind: "blocked";
  impact: TradeImpactResponse;
};

export type TradeCommitResult = TradeCommitSuccess | TradeCommitBlocked;
