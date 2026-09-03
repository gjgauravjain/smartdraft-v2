import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { PlayerDatabaseType } from "@/app/api/type/player";
import {
  TradeImpactResponse,
  TradeImpactTeam,
  TradeValidity,
  TradeValidityChecks,
} from "@/app/api/type/trade";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import {
  GroupedTradePicks,
  TradeLane,
  TradeLanePick,
  TradeLanePlayer,
} from "./type";

let laneSeq = 0;

export const createEmptyLane = (): TradeLane => ({
  id: `lane-${++laneSeq}`,
  teamId: "",
  picksIn: [],
  playersIn: [],
});

export const createDefaultLanes = (): TradeLane[] => [
  createEmptyLane(),
  createEmptyLane(),
];

export const toLanePick = (pick: DraftPicksDataType): TradeLanePick => ({
  unique: pick.unique,
  label: pick.display || pick.label,
  points: pick.value,
  overallPick: pick.overallPick,
  year: pick.year,
  currentOwner: String(pick.currentOwner),
});

export const toLanePlayer = (player: PlayerDatabaseType): TradeLanePlayer => ({
  playerId: String(player.id),
  playerName:
    `${player.preferredFirstName || player.firstName} ${player.preferredLastName || player.lastName}`.trim(),
  fromTeamId: player.currentRoasterAllocation?.teamId
    ? String(player.currentRoasterAllocation.teamId)
    : "",
});

export const sumLanePickPoints = (picks: TradeLanePick[]) =>
  picks.reduce((total, pick) => total + pick.points, 0);

export const selectedPickUniques = (lanes: TradeLane[]) =>
  new Set(lanes.flatMap((lane) => lane.picksIn.map((pick) => pick.unique)));

export const selectedPlayerIds = (lanes: TradeLane[]) =>
  new Set(
    lanes.flatMap((lane) => lane.playersIn.map((player) => player.playerId)),
  );

export const ensureClubLane = (
  teamId: string,
  lanes: TradeLane[],
): TradeLane[] => {
  if (!teamId || lanes.some((lane) => lane.teamId === teamId)) {
    return lanes;
  }

  const emptyIndex = lanes.findIndex((lane) => !lane.teamId);
  if (emptyIndex >= 0) {
    return lanes.map((lane, index) =>
      index === emptyIndex ? { ...lane, teamId } : lane,
    );
  }

  return [...lanes, { ...createEmptyLane(), teamId }];
};

export const buildClubOptions = (teams: TeamType[]): SelectOption[] =>
  teams.map((team) => ({
    value: String(team.id),
    label: team.teamNames,
    icon: team.image,
  }));

export const groupTradePicks = ({
  picks,
  teamsById,
  selectedUniques,
}: {
  picks: DraftPicksDataType[];
  teamsById: Map<string, TeamType>;
  selectedUniques: Set<string>;
}): GroupedTradePicks[] => {
  const available = picks.filter((pick) => pick.pickStatus !== "Used");
  const byClub = new Map<string, DraftPicksDataType[]>();

  available.forEach((pick) => {
    const clubId = String(pick.currentOwner);
    const list = byClub.get(clubId) ?? [];
    list.push(pick);
    byClub.set(clubId, list);
  });

  return [...byClub.entries()]
    .map(([clubId, clubPicks]) => {
      const byYear = new Map<number, DraftPicksDataType[]>();
      clubPicks.forEach((pick) => {
        const list = byYear.get(pick.year) ?? [];
        list.push(pick);
        byYear.set(pick.year, list);
      });

      const years = [...byYear.entries()]
        .sort(([a], [b]) => a - b)
        .map(([year, yearPicks]) => ({
          year,
          picks: [...yearPicks]
            .sort((a, b) => a.overallPick - b.overallPick)
            .map((pick) => ({
              ...pick,
              disabled: selectedUniques.has(pick.unique),
            })),
        }));

      return {
        clubId,
        clubName: teamsById.get(clubId)?.teamNames ?? clubId,
        years,
      };
    })
    .sort((a, b) => a.clubName.localeCompare(b.clubName));
};

export const isTradeReadyToPreview = (lanes: TradeLane[]) => {
  const clubCount = new Set(lanes.map((lane) => lane.teamId).filter(Boolean))
    .size;
  const hasAsset = lanes.some(
    (lane) => lane.picksIn.length > 0 || lane.playersIn.length > 0,
  );
  return clubCount >= 2 && hasAsset;
};

export const addPickToLane = (
  lanes: TradeLane[],
  laneId: string,
  pick: DraftPicksDataType,
): TradeLane[] => {
  if (selectedPickUniques(lanes).has(pick.unique)) {
    return lanes;
  }

  const withPick = lanes.map((lane) =>
    lane.id === laneId
      ? { ...lane, picksIn: [...lane.picksIn, toLanePick(pick)] }
      : lane,
  );

  return ensureClubLane(String(pick.currentOwner), withPick);
};

export const addPlayerToLane = (
  lanes: TradeLane[],
  laneId: string,
  player: TradeLanePlayer,
): TradeLane[] => {
  if (selectedPlayerIds(lanes).has(player.playerId)) {
    return lanes;
  }

  const withPlayer = lanes.map((lane) =>
    lane.id === laneId
      ? { ...lane, playersIn: [...lane.playersIn, player] }
      : lane,
  );

  return ensureClubLane(player.fromTeamId, withPlayer);
};

export const formatPoints = (value: number) =>
  Math.round(value).toLocaleString("en-US");

export const formatSignedPoints = (value: number) => {
  const formatted = formatPoints(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
};

export const clubShortName = (team?: TeamType, fallback = "") =>
  team?.shortName || fallback;

export const passedCheckCount = (checks: TradeValidityChecks) =>
  [checks.tradeBackRule, checks.pickExists, checks.picksMatch].filter(
    (check) => check.status === "Pass",
  ).length;

export const maxAbsNet = (teams: TradeImpactTeam[]) =>
  Math.max(...teams.map((team) => Math.abs(team.netResult)), 1);

export const beamFillPercent = (netResult: number, maxAbs: number) =>
  (Math.abs(netResult) / maxAbs) * 50;

export const tradeWinner = (teams: TradeImpactTeam[]) =>
  teams.reduce<TradeImpactTeam | null>((best, team) => {
    if (!best || team.netResult > best.netResult) return team;
    return best;
  }, null);

export const validityBadgeClass = (validity: TradeValidity) => {
  if (validity === "Invalid") {
    return "border-destructive/40 bg-destructive/10 text-destructive";
  }
  if (validity === "Warning") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }
  return "border-success-border bg-success-surface text-success";
};

export const tradeFooterNote = ({
  impactLoading,
  impactError,
  readyToPreview,
  impactData,
}: {
  impactLoading: boolean;
  impactError: string | null;
  readyToPreview: boolean;
  impactData: TradeImpactResponse | null;
}) => {
  if (impactLoading) return "Updating impact preview…";
  if (impactError) return impactError;
  if (!readyToPreview) {
    return "Select clubs and add at least one asset to preview.";
  }
  if (
    impactData &&
    (impactData.summaryValidity === "Invalid" ||
      impactData.summaryValidity === "Warning")
  ) {
    return impactData.summaryDescription;
  }
  return "";
};

export const checkPickLabel = (pick: unknown) => {
  if (typeof pick === "string" || typeof pick === "number") {
    return String(pick);
  }
  if (!pick || typeof pick !== "object") return "";
  const item = pick as Record<string, unknown>;
  const name = item.pick_name ?? item.pickName ?? item.label ?? item.pick;
  return name == null ? "" : String(name);
};

export const FALLBACK_ADD_LANE: TradeLane = {
  id: "",
  teamId: "",
  picksIn: [],
  playersIn: [],
};
