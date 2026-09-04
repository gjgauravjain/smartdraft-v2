import {
  TradeAssetPick,
  TradeAssetPlayer,
  TradeHandPick,
  TradeHandYear,
  TradeImpactResponse,
  TradeImpactTeam,
  TradeRequestPayload,
  TradeValidity,
  TradeValidityCheck,
  TradeValidityChecks,
} from "../type/trade";

const EMPTY_VALIDITY_CHECK: TradeValidityCheck = {
  status: "Pass",
  description: "",
  picks: [],
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toNullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const transformHandPick = (item: any): TradeHandPick => ({
  pick: toNumber(item?.pick),
  pickStatus: item?.pick_status ?? "",
  pickName: item?.pick_name ?? "",
  round: toNumber(item?.round),
  incoming: Boolean(item?.incoming),
});

const transformHandYear = (item: any): TradeHandYear => ({
  year: toNumber(item?.year),
  points: toNumber(item?.points),
  picks: Array.isArray(item?.picks) ? item.picks.map(transformHandPick) : [],
});

const transformAssetPick = (item: any): TradeAssetPick => ({
  unique: item?.unique ?? "",
  pickName: item?.pick_name ?? "",
  overallPick: toNumber(item?.overall_pick),
});

const transformAssetPlayer = (item: any): TradeAssetPlayer => ({
  playerId: String(item?.player_id ?? ""),
  playerName: item?.player_name ?? "",
});

const transformValidityCheck = (item: any): TradeValidityCheck => ({
  status: item?.status ?? "Pass",
  description: item?.description ?? "",
  picks: Array.isArray(item?.picks) ? item.picks : [],
});

const transformValidityChecks = (item: any): TradeValidityChecks => ({
  tradeBackRule: transformValidityCheck(
    item?.trade_back_rule ?? EMPTY_VALIDITY_CHECK,
  ),
  pickExists: transformValidityCheck(item?.pick_exists ?? EMPTY_VALIDITY_CHECK),
  picksMatch: transformValidityCheck(item?.picks_match ?? EMPTY_VALIDITY_CHECK),
});

const transformImpactTeam = (item: any): TradeImpactTeam => ({
  teamId: toNumber(item?.team_id),
  teamName: item?.team_name ?? "",
  netResult: toNumber(item?.net_result),
  netResultEquivalentPick: toNullableNumber(item?.net_result_equivalent_pick),
  ptsIn: toNumber(item?.pts_in),
  ptsOut: toNumber(item?.pts_out),
  picksIn: Array.isArray(item?.picks_in)
    ? item.picks_in.map(transformAssetPick)
    : [],
  picksOut: Array.isArray(item?.picks_out)
    ? item.picks_out.map(transformAssetPick)
    : [],
  playersIn: Array.isArray(item?.players_in)
    ? item.players_in.map(transformAssetPlayer)
    : [],
  playersOut: Array.isArray(item?.players_out)
    ? item.players_out.map(transformAssetPlayer)
    : [],
  handBefore: Array.isArray(item?.hand_before)
    ? item.hand_before.map(transformHandYear)
    : [],
  handAfter: Array.isArray(item?.hand_after)
    ? item.hand_after.map(transformHandYear)
    : [],
});

const toValidity = (value: unknown): TradeValidity => {
  if (value === "Warning" || value === "Invalid" || value === "Valid") {
    return value;
  }
  return "Valid";
};

export const transformTradeImpactResponse = (
  response: any,
): TradeImpactResponse => ({
  summaryDescription: response?.summary_description ?? "",
  summaryValidity: toValidity(response?.summary_validity),
  teams: Array.isArray(response?.teams)
    ? response.teams.map(transformImpactTeam)
    : [],
  validityChecks: transformValidityChecks(response?.validity_checks),
});

export type TradePayloadTeamInput = {
  teamId: string | number;
  picksIn: { unique: string; label: string }[];
  playersIn: {
    playerId: string;
    playerName: string;
    fromTeamId: string | number;
  }[];
};

export const buildTradeRequestPayload = (
  teams: TradePayloadTeamInput[],
): TradeRequestPayload => ({
  teams: teams
    .filter((team) => String(team.teamId).length > 0)
    .map((team) => ({
      team_id: Number(team.teamId),
      picks_in: team.picksIn.map((pick) => ({
        unique: pick.unique,
        label: pick.label,
      })),
      players_in: team.playersIn
        .filter((player) => String(player.fromTeamId).length > 0)
        .map((player) => ({
          player_id: player.playerId,
          player_name: player.playerName,
          from_team_id: Number(player.fromTeamId),
        })),
    })),
});
