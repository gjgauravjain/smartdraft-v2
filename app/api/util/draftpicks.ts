import { TabOptionType } from "../type/common";
import {
  DashboardDataType,
  DashboardList,
  DraftBoardType,
  DRAFTED_PLAYER,
  TransactionDescriptionType,
  TransactionMultiPicksType,
  TransactionMultiPlayersType,
  TransactionSourceType,
  TransactionSourceApiTradeTypeNew,
  TransactionSourceAcademyBidMatchNew,
  TransactionSourceAcademyBidType,
  TransactionSourceFaCompensationType,
  TransactionSourceFSBidType,
  TransactionSourceFatherSonBidMatchNew,
  TransactionSourceManualPickEditType,
  TransactionSourceManualPickMoveType,
  TransactionSourceManualPickNew,
  TransactionSourceNgaBidMatchNew,
  TransactionSourceTradeType,
  TransactionPriorityPickTradeTypeNew,
  TransactionSourceDraftedPlayerType,
  TransactionSourceMultiTradeTypeNew,
  TransactionFreeAgentScourceTypeNew,
  TransactionSourcePassPickEditType,
  TransactionSourceDraftNightSelectionNew,
  TransactionListType,
  DraftAssetType,
  DataOrderEntryType,
  DraftYearType,
  DataFullOrderListType,
  DraftYearList,
  DraftPickType,
} from "../type/draftpicks";
import { compact, flatten, min, max } from "lodash";

const transformDashboarMasterList = (data: any): DashboardList[] => {
  if (data.length === 0 || !data) {
    return [];
  }

  return data.map((item: any, index: number) => ({
    aflPointValue: item.AFL_Points_Value,
    displayNameShort: item.Display_Name_Short,
    image: item.Images,
    pickStatus: item.Pick_Status,
    year: item.Year,
    id: index + 1,
    overallPick: item.Overall_Pick,
    currentOwner: item.Current_Owner,
    currentOwnerShortName: item.Current_Owner_Short_Name,
    draftRound: item.Draft_Round,
    previousOwner: item.Previous_Owner,
    originalOwner: item.Original_Owner,
    pointsPlayer: item.Points_Player,
    reason: item.Reason,
  }));
};

const transformDraft = (data: any): DraftBoardType[] => {
  if (!data) {
    return [];
  }
  const transformDashboardData = data
    .map((item: any, index: number) => ({
      name: item.Full_Name,
      rank: parseInt(item.Rank),
      id: index + 1,
      position: item.Position_1,
      flag: item.Flag || (item.Selected === true ? DRAFTED_PLAYER : ""),
    }))
    .sort(
      (a: DraftBoardType, b: DraftBoardType) =>
        parseInt(a.rank) - parseInt(b.rank),
    );
  return transformDashboardData;
};

const transformTransactionDescription = (
  data: any,
): TransactionDescriptionType => {
  return {
    transactionDescription: data.Transaction_Description,
    transactionDetails: data.transaction_details,
    transactionNumber: data.Transaction_Number,
    transactionType: data.Transaction_Type,
  };
};

const transformMultiPicksIn = (data: any): TransactionMultiPicksType[] => {
  if (!data) {
    return [];
  }

  return data.map(
    (item: any) =>
      ({
        currentOwner: item.current_owner,
        display: item.display,
        overallPick: item.overall_pick,
        pickStatus: item.pick_status,
        unique: item.unique,
        value: item.value,
      }) as TransactionMultiPicksType,
  );
};

const transformMultiPlayersType = (
  data: any,
): TransactionMultiPlayersType[] => {
  if (!data) {
    return [];
  }

  return data.map(
    (item: any) =>
      ({
        playerId: item.player_id,
        teamId: item.team_id,
      }) as TransactionMultiPlayersType,
  );
};

const transformTransactionSource = (
  transactionType: string,
  data: any,
): TransactionSourceType => {
  if (transactionType === "Priority Pick") {
    return {
      pickType: data.pick_type,
      ppid: data.ppid,
      ppInsertInstruction: data.pp_insert_instructions,
      projectId: data.projectId,
      reason: data.reason,
      teamid: data.teamid,
      trasnsactionDescription: data.transaction_description,
      uniquePick: data.unique_pick,
    } as TransactionPriorityPickTradeTypeNew;
  }
  if (transactionType === "Pass All Picks") {
    return {
      passType: data.pass_type,
      pickId: data.pickid,
      teamId: data.teamid,
    } as TransactionSourcePassPickEditType;
  }
  if (transactionType === "Pass Pick") {
    return {
      passType: data.pass_type,
      pickId: data.pickid,
      teamId: data.teamid,
    } as TransactionSourcePassPickEditType;
  }
  if (transactionType === "Multi Team Trade") {
    return data.map(
      (item: any) =>
        ({
          teamId: item.team_id,
          picksIn: transformMultiPicksIn(item.picks_in),
          playersIn: transformMultiPlayersType(item.players_in),
        }) as TransactionSourceMultiTradeTypeNew,
    ) as TransactionSourceMultiTradeTypeNew[];
  }

  if (transactionType === "Free Agent Compensation") {
    return {
      instructions: data.instructions,
      pickId: data.pick_id,
      pickType: data.pick_type,
      reason: data.reason,
      teamId: data?.team_id || data?.teamid,
      transactionDescrpition: data.transaction_description,
      unqiuePick: data.unique_pick,
    } as TransactionFreeAgentScourceTypeNew;
  }
  if (transactionType === "FA_Compensation") {
    return {
      faInsertInstruction: data.fa_insert_instructions,
      faPickType: data.fa_pick_type,
      faTeamId: data.fa_team,
      pickId: data.pick_id,
      reason: data.reason,
    } as TransactionSourceFaCompensationType;
  }
  if (transactionType === "Father Son Bid") {
    return {
      fsTeam: data.fs_team,
      pickId: data.pickid,
      playerId: data.playerid,
      transactionDescription: data.transaction_description,
    } as TransactionSourceFatherSonBidMatchNew;
  }
  if (transactionType === "Academy Bid") {
    return {
      academyTeam: data.academy_team,
      pickId: data.pickid,
      playerId: data.playerid,
      transactionDescription: data.transaction_description,
    } as TransactionSourceAcademyBidMatchNew;
  }
  if (transactionType === "FS_Bid_Match") {
    return {
      fsBid: data.fs_bid,
      fsPlayer: data.fs_player,
      fsTeam: data.fs_team,
    } as TransactionSourceFSBidType;
  }
  if (transactionType === "Drafted_Player") {
    return {
      playerTaken: data.player_taken,
      selectedPickId: data.selected_pick_id,
    } as TransactionSourceDraftedPlayerType;
  }
  if (transactionType === "Trade" && !data.picks_trading_out_team1_obj) {
    return {
      pickid1: data.pickid1,
      pickid2: data.pickid2,
      player1: data.player1,
      player2: data.player2,
      team1: data?.team1 || data.teamid1 || "",
      team2: data?.team2 || data.teamid2 || "",
    } as TransactionSourceApiTradeTypeNew;
  }
  if (transactionType === "Trade") {
    return {
      picksTradingOutTeam1: data.picks_trading_out_team1_obj,
      picksTradingOutTeam2: data.picks_trading_out_team2_obj,
      team1: data.team1,
      team1TradesPlayers: data.team1_trades_players,
      team2: data.team2,
      team2TradesPlayers: data.team2_trades_players,
    } as TransactionSourceTradeType;
  }
  if (transactionType === "Academy_Bid_Match") {
    return {
      academyPlayer: data.academy_player,
      pickId: data.pick_id,
      teamId: data.teamid,
    } as TransactionSourceAcademyBidType;
  }
  if (transactionType === "Manual_Pick_Move") {
    return {
      pickBeinMovedVal: data.pick_being_moved_val,
      pickDestinationRound: data.pick_destination_round,
      pickDestinationVal: data.pick_destination_val,
      pickMoveInsertInstruction: data.pick_move_insert_instructions,
      pickMoveTeam: data.pick_move_team,
      reason: data.reason,
    } as TransactionSourceManualPickMoveType;
  }
  if (transactionType === "NGA Bid") {
    return {
      pickId: data.pickid,
      playerId: data.playerid,
      teamId: data.teamid,
      transactionDescription: data.transaction_description,
    } as TransactionSourceNgaBidMatchNew;
  }
  if (transactionType === "Draft Night Selection") {
    return {
      playerTakenId: data.player_taken_id,
      selectedPickId: data.selected_pick_id,
      teamId: data.teamid,
      transactionDescription: data.transaction_description,
    } as TransactionSourceDraftNightSelectionNew;
  }
  if (transactionType === "manual_pick_edit") {
    return {
      newOwner: data.new_owner,
      pickName: data.pick_name,
      reason: data.reason,
      viaOwner: data.via_owner,
      teamid: data.teamid,
    } as TransactionSourceManualPickEditType;
  }
  if (transactionType === "Manual Pick Edit") {
    return {
      originalOwner: data.original_owner,
      pick: data.pick,
      reason: data.reason,
      teamNew: data.team_new,
      teamVia: data.team_via,
      uniquePick: data.unique_pick,
      transactionDescription: data.transaction_description,
    } as TransactionSourceManualPickNew;
  }
  return null;
};

const transformTransactionList = (data: any): TransactionListType[] => {
  if (!data) return [];

  return data.map((item: any, index: number) => ({
    id: index + 1,
    ...transformTransactionDescription(item),
    sourceApi: transformTransactionSource(
      item.Transaction_Type,
      item.source_api,
    ),
  }));
};

export const transformDashboardData = (data: any): DashboardDataType | null => {
  if (!data) {
    return null;
  }
  return {
    dataDashboardDraftboard: transformDraft(data.player_data),
    dataDashboardMasterlist: transformDashboarMasterList(data.draft_order),
    dataDashboardTradeOffers: [],
    transactionList: transformTransactionList(data.transactions),
  };
};

export const transformDataOrderNewEntry = (data: any): DataOrderEntryType[] => {
  if (!data) {
    return [];
  }
  console.log("data", data);
  const overallPicks = data.map((item: any) => [...item.Overall_Pick]);
  const flat = flatten(overallPicks);
  const minimumValue = min(compact(flat));
  const maximumValue = max(compact(flat));
  return data.map(({ TeamNames, Overall_Pick }: any) => {
    const orders = Array.from(
      { length: Overall_Pick.length },
      (_, i) => Overall_Pick[i] || "",
    );
    return Object.assign(
      {
        minimumValue: minimumValue,
        maximumValue: maximumValue,
        id: TeamNames,
        teamName: TeamNames,
        totalOrderLength: Overall_Pick.length,
        currentOrderLength: compact(Overall_Pick).length,
      },
      ...orders.map((order, i) => ({ [`order_${i + 1}`]: order })),
    );
  });
};

export const transformDraftYearList = (data: any): DraftYearList[] => {
  if (!data) {
    return [];
  }

  return data.map((item: Record<string, any>, index: number) => ({
    aflPointValue: item.AFL_Points_Value,
    displayNameShort: item.Display_Name_Short,
    draftRound: item.Draft_Round,
    image: item?.Images || item.Image,
    teamId: item?.teamid || item.Current_Owner,
    reason: item.reason || item.Reason,
    id: index + 1,
    overallPick: Number(item.Overall_Pick),
    clubPickNumber: item?.club_pick_number || item.Club_Pick_Number || "",
    currentOwnerShort:
      item?.current_owner_short || item.Current_Owner_Short_Name || "",
    pointPlayer: item.Points_Player,
  }));
};

export const transformDashboardDraftCurrentYear = (
  data: any,
  currentYear?: string,
): DraftYearType => {
  let filterData = data?.filter((item: any) => item.Year === currentYear);
  return {
    rd1List: transformDraftYearList(
      filterData?.filter((item: any) => item.Draft_Round === "RD1"),
    ),
    rd2List: transformDraftYearList(
      filterData?.filter((item: any) => item.Draft_Round === "RD2"),
    ),
    rd3List: transformDraftYearList(
      filterData?.filter((item: any) => item.Draft_Round === "RD3"),
    ),
    rd4List: transformDraftYearList(
      filterData?.filter((item: any) => item.Draft_Round === "RD4"),
    ),
    rd5List: transformDraftYearList(
      filterData?.filter((item: any) => item.Draft_Round === "RD5"),
    ),
    rd6List: transformDraftYearList(
      filterData?.filter(
        (item: any) =>
          !["RD1", "RD2", "RD3", "RD4", "RD5"].includes(item.Draft_Round),
      ),
    ),
  };
};
export const transformDashboardFullOrderList = (
  data: any,
): DataFullOrderListType[] => {
  if (!data) {
    return [];
  }

  return data.map((item: Record<string, any>, index: number) => ({
    aflPointValue: item.AFL_Points_Value,
    clubPickNumber: item.Club_Pick_Number,
    currentOwner: item.Current_Owner,
    draftRound: item.Draft_Round,
    originalOwner: item.Original_Owner,
    overallPick: item.Overall_Pick,
    pickType: item?.Pick_Status,
    previousOwner: item.Previous_Owner,
    reason: item.Reason,
    selectedPlayer: item.Selected_Player,
    shortName: item?.Current_Owner_Short_Name,
    teamName: item.TeamName,
    year: item.Year,
    id: index + 1,
  }));
};

const tranformDashboardDraftAssetList = (data: any): DraftAssetType[] => {
  if (!data) return [];

  return data.map((item: any) => ({
    ownerName: item.Current_Owner_Short_Name,
    aflPoints: Number(item.AFL_Points_Value),
    year: item.Year,
  }));
};

export const transformNewDraftPick = (dashboardData: any): DraftPickType => {
  return {
    dataOrderEntry: transformDataOrderNewEntry(dashboardData?.order_of_entry),
    draftCurrentYear: transformDashboardDraftCurrentYear(
      dashboardData?.draft_order,
      dashboardData?.current_year.toString(),
    ),
    draftNextYear: transformDashboardDraftCurrentYear(
      dashboardData?.draft_order,
      dashboardData?.next_year.toString(),
    ),
    draftThirdYear: transformDashboardDraftCurrentYear(
      dashboardData?.draft_order,
      dashboardData?.third_year?.toString(),
    ),
    fullOrderList: transformDashboardFullOrderList(dashboardData?.draft_order),
    draftAsset: tranformDashboardDraftAssetList(dashboardData?.draft_assets),
    currentYear: dashboardData?.current_year.toString(),
    thirdYear: dashboardData?.third_year?.toString(),
    nextYear: dashboardData?.next_year.toString(),
  };
};

export const transformDashboardDraftTab = (data: any): TabOptionType[] => {
  if (!data) {
    return [];
  }
  return [
    {
      label: `${data?.current_year} Draft Picks`,
      value: "current",
    },
    {
      label: `${data?.next_year} Draft Picks`,
      value: "next",
    },
    {
      label: `${data?.third_year} Draft Picks`,
      value: "third",
      toHide: !data?.third_year,
    },
  ];
};
