export const DRAFTED_PLAYER = "Drafted";

export type DashboardList = {
  aflPointValue: string;
  displayNameShort: string;
  image: string;
  pickStatus: string;
  year: string;
  overallPick: string;
  currentOwner: number;
  currentOwnerShortName: string;
  draftRound: string;
  previousOwner: string;
  originalOwner: number;
  pointsPlayer: string;
  reason: string;
};

export type TransactionSourcePriorityPickType = {
  ppId: string;
  ppInsertInstruction: string;
  ppPickType: string;
  ppTeamId: string;
  projectId: number;
  reason: string;
};

export type TransactionSourceFaCompensationType = {
  pickId: string;
  faInsertInstruction: string;
  faPickType: string;
  faTeamId: string;
  reason: string;
};

export type TransactionSourceFSBidType = {
  fsBid: string;
  fsPlayer: string;
  fsTeam: string;
};

export type TransactionSourceDraftedPlayerType = {
  playerTaken: string;
  selectedPickId: string;
};

export type TransactionSourceTradeType = {
  picksTradingOutTeam1: {
    label: string;
    value: string;
  }[];
  picksTradingOutTeam2: {
    label: string;
    value: string;
  }[];
  team1: number;
  team1TradesPlayers: string[];
  team2: number;
  team2TradesPlayers: string[];
};
export interface TransactionDescriptionType {
  transactionDescription: string;
  transactionNumber: string;
  transactionType: string;
  transactionDetails: string;
}

export interface TransactionSourceTradeTypeNew extends TransactionDescriptionType {
  sourceApi: TransactionSourceApiTradeTypeNew;
}

export type TransactionSourceApiTradeTypeNew = {
  pickid1: TransactionPickId1TradeTypeNew[];
  pickid2: TransactionPickId1TradeTypeNew[];
  player1: string[];
  player2: string[];
  team1: number;
  team2: number;
};
export interface TransactionPriorityPickTypeNew extends TransactionDescriptionType {
  sourceApi: TransactionPriorityPickTradeTypeNew;
}

export type TransactionPriorityPickTradeTypeNew = {
  pickType: string;
  ppInsertInstruction: string;
  ppid: string;
  projectId: number;
  reason: string;
  teamid: string;
  trasnsactionDescription: string;
  uniquePick: string;
};

export interface TransactionFreeAgentTransactionNew extends TransactionDescriptionType {
  sourceApi: TransactionFreeAgentScourceTypeNew;
}

export interface TransactionMultiTradeNew extends TransactionDescriptionType {
  sourceApi: TransactionSourceMultiTradeTypeNew[];
}

export type TransactionMultiPicksType = {
  currentOwner: string;
  display: string;
  overallPick: number;
  pickStatus: string;
  unique: string;
  value: number;
};

export type TransactionMultiPlayersType = {
  playerId: string;
  teamId: number;
};

export type TransactionSourceMultiTradeTypeNew = {
  teamId: string;
  picksIn: TransactionMultiPicksType[];
  playersIn: TransactionMultiPlayersType[];
};

export type TransactionFreeAgentScourceTypeNew = {
  instructions: string;
  pickId: string;
  pickType: string;
  reason: string;
  teamId: string;
  transactionDescrpition: string;
  unqiuePick: string;
};

export interface TransactionFatherSonBidMatchTransactionNew extends TransactionDescriptionType {
  sourceApi: TransactionSourceFatherSonBidMatchNew;
}

export type TransactionSourceFatherSonBidMatchNew = {
  fsTeam: string;
  pickId: string;
  playerId: string;
  transactionDescription: string;
};

export type TransactionSourceAcademyBidMatchNew = {
  academyTeam: string;
  pickId: string;
  playerId: string;
  transactionDescription: string;
};

export interface TransactionNgaBidTransactionNew extends TransactionDescriptionType {
  sourceApi: TransactionSourceNgaBidMatchNew;
}

export type TransactionSourceNgaBidMatchNew = {
  pickId: string;
  playerId: string;
  teamId: string;
  transactionDescription: string;
};

export interface TransactionDraftNightSelectionNew extends TransactionDescriptionType {
  sourceApi: TransactionSourceDraftNightSelectionNew;
}

export type TransactionSourceDraftNightSelectionNew = {
  playerTakenId: string;
  selectedPickId: string;
  teamId: number;
  transactionDescription: string;
};

export interface TransactionManualPickNew extends TransactionDescriptionType {
  sourceApi: TransactionSourceManualPickNew;
}

export type TransactionSourceManualPickNew = {
  originalOwner: number;
  pick: string;
  reason: string;
  teamNew: string;
  teamVia: string;
  uniquePick: string;
  transactionDescription: string;
};

export type TransactionPickId1TradeTypeNew = {
  label: string;
  unique: string;
  value: number;
};

export type TransactionSourceAcademyBidType = {
  academyPlayer: string;
  pickId: string;
  teamId: string;
};

export type TransactionSourceManualPickMoveType = {
  pickBeinMovedVal: string;
  pickDestinationRound: string;
  pickDestinationVal: string;
  pickMoveInsertInstruction: string;
  pickMoveTeam: string;
  reason: string;
};

export type TransactionSourceManualPickEditType = {
  newOwner: string;
  pickName: string;
  viaOwner: string;
  reason: string;
  teamid: string;
};

export type TransactionSourcePassPickEditType = {
  passType: string;
  pickId: string;
  teamId: number;
};

export type TransactionSourceType =
  | TransactionSourcePriorityPickType
  | TransactionSourceFaCompensationType
  | TransactionSourceFSBidType
  | TransactionSourceDraftedPlayerType
  | TransactionSourceTradeType
  | TransactionSourceAcademyBidType
  | TransactionSourceManualPickMoveType
  | TransactionSourceManualPickEditType
  | TransactionSourceTradeTypeNew
  | TransactionPriorityPickTradeTypeNew
  | TransactionSourceFatherSonBidMatchNew
  | TransactionFreeAgentScourceTypeNew
  | TransactionSourceNgaBidMatchNew
  | TransactionSourceDraftNightSelectionNew
  | TransactionSourceManualPickNew
  | TransactionSourceApiTradeTypeNew
  | TransactionSourceAcademyBidMatchNew
  | TransactionSourceMultiTradeTypeNew[]
  | TransactionSourcePassPickEditType
  | null;

export type TransactionListType = {
  transactionNumber: number;
  transactionType: string;
  transactionDescription: string;
  sourceApi: TransactionSourceType;
};

export type TradeOffersType = {
  tradePartner: string;
  pointsDiff: string;
  tradingIn: string;
  manager: string;
};

export type DraftBoardType = {
  name: string;
  rank: string;
  id: number;
  position: string;
  flag: string;
};

export type DashboardDataType = {
  draftData?: DraftType;
  dataDashboardDraftboard: DraftBoardType[];
  dataDashboardMasterlist: DashboardList[];
  dataDashboardTradeOffers: TradeOffersType[];
  transactionList: TransactionListType[];
};

export type YearClubPickType = {
  key: string;
  value: number[];
};

export type DraftType = {
  draftPointNextYear: number[];
  draftPointThisYear: number[];
  dataCurrentYearClubPickData: YearClubPickType[];
  dataNextYearClubPicks: YearClubPickType[];
  next_team_to_pick: string;
};

export type DraftAssetType = {
  ownerName: string;
  aflPoints: number;
  year: string;
};

export type DraftYearList = {
  aflPointValue: string;
  displayNameShort: string;
  draftRound: string;
  image: string;
  id: number;
  overallPick: string;
  teamId: number;
  clubPickNumber: string;
  currentOwnerShort: string;
  pointPlayer: string;
};

export type DraftYearType = {
  rd1List: DraftYearList[];
  rd2List: DraftYearList[];
  rd3List: DraftYearList[];
  rd4List: DraftYearList[];
  rd5List: DraftYearList[];
  rd6List: DraftYearList[];
};

export type DataOrderEntryType = {
  teamName: string;
  totalOrderLength: number;
  id: number;
  minimumValue: number;
  maximumValue: number;
};

export type DataFullOrderListType = {
  aflPointValue: string;
  clubPickNumber: string;
  currentOwner: string;
  draftRound: string;
  originalOwner: string;
  overallPick: string;
  pickType: string;
  previousOwner: string;
  reason: string;
  selectedPlayer: string;
  shortName: string;
  teamName: string;
  year: string;
  id: number;
};

export type DraftPickType = {
  draftCurrentYear: DraftYearType;
  draftNextYear: DraftYearType;
  draftThirdYear: DraftYearType;
  dataOrderEntry: DataOrderEntryType[];
  fullOrderList: DataFullOrderListType[];
  draftAsset: DraftAssetType[];
  currentYear?: string;
  nextYear?: string;
  thirdYear?: string;
};
