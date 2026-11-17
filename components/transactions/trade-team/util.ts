import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { PlayerLookupType } from "@/app/api/type/player";
import {
  TradeImpactResponse,
  TradeImpactTeam,
  TradeValidity,
  TradeValidityChecks,
} from "@/app/api/type/trade";
import { buildTradeRequestPayload } from "@/app/api/util/trade";
import {
  TradeAssetRow,
  TradeHandChip,
  TradeHandView,
  TradeLane,
  TradeLanePick,
  TradeLanePlayer,
  TradePickerTab,
  TradeStatusModel,
} from "./type";

let laneSeq = 0;

export const TRADE_IDLE = "Add picks or players to calculate the impact.";
export const TRADE_CHECKING = "Checking the trade.";
export const TRADE_ERROR =
  "Something went wrong. Check the details and try again.";

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
  label: pick.label,
  display: pick.display || pick.label,
  points: pick.points,
  year: pick.year,
  currentOwner: String(pick.currentOwner),
});

export const selectedPickUniques = (lanes: TradeLane[]) =>
  new Set(lanes.flatMap((lane) => lane.picksIn.map((pick) => pick.unique)));

export const clubCount = (lanes: TradeLane[]) =>
  new Set(lanes.map((lane) => lane.teamId).filter(Boolean)).size;

export const hasTradeAsset = (lanes: TradeLane[]) =>
  lanes.some((lane) => lane.picksIn.length > 0 || lane.playersIn.length > 0);

export const isTradeReadyToPreview = (lanes: TradeLane[]) =>
  clubCount(lanes) >= 2 && hasTradeAsset(lanes);

export const tradePayloadFromLanes = (lanes: TradeLane[]) =>
  buildTradeRequestPayload(
    lanes.map((lane) => ({
      teamId: lane.teamId,
      picksIn: lane.picksIn.map((pick) => ({
        unique: pick.unique,
        label: pick.label,
      })),
      playersIn: lane.playersIn.map((player) => ({
        playerId: player.playerId,
        playerName: player.playerName,
        fromTeamId: player.fromTeamId,
      })),
    })),
  );

const stripDepartedClub = (lanes: TradeLane[], teamId: string) => {
  if (!teamId || lanes.some((lane) => lane.teamId === teamId)) return lanes;
  return lanes.map((lane) => ({
    ...lane,
    picksIn: lane.picksIn.filter((pick) => pick.currentOwner !== teamId),
    playersIn: lane.playersIn.filter((player) => player.fromTeamId !== teamId),
  }));
};

export const setLaneClub = (
  lanes: TradeLane[],
  laneId: string,
  teamId: string,
) => {
  const current = lanes.find((lane) => lane.id === laneId);
  if (!current || current.teamId === teamId) return lanes;
  const previousTeamId = current.teamId;
  const next = lanes.map((lane) =>
    lane.id === laneId
      ? {
          ...lane,
          teamId,
          picksIn: lane.picksIn.filter((pick) => pick.currentOwner !== teamId),
          playersIn: lane.playersIn.filter(
            (player) => player.fromTeamId !== teamId,
          ),
        }
      : lane,
  );
  return stripDepartedClub(next, previousTeamId);
};

export const removeLane = (lanes: TradeLane[], laneId: string) => {
  if (lanes.length <= 2) return lanes;
  const removed = lanes.find((lane) => lane.id === laneId);
  const rest = lanes.filter((lane) => lane.id !== laneId);
  return stripDepartedClub(rest, removed?.teamId ?? "");
};

export const addClubLane = (lanes: TradeLane[], teamId: string) => {
  if (!teamId || lanes.some((lane) => lane.teamId === teamId)) return lanes;
  return [...lanes, { ...createEmptyLane(), teamId }];
};

const ensureClubLane = (teamId: string, lanes: TradeLane[]) => {
  if (!teamId || lanes.some((lane) => lane.teamId === teamId)) return lanes;
  const emptyIndex = lanes.findIndex((lane) => !lane.teamId);
  if (emptyIndex >= 0) {
    return lanes.map((lane, index) =>
      index === emptyIndex ? { ...lane, teamId } : lane,
    );
  }
  return [...lanes, { ...createEmptyLane(), teamId }];
};

export const addPickToLane = (
  lanes: TradeLane[],
  laneId: string,
  pick: DraftPicksDataType,
) => {
  const receiver = lanes.find((lane) => lane.id === laneId);
  if (!receiver?.teamId || String(pick.currentOwner) === receiver.teamId) {
    return lanes;
  }
  if (selectedPickUniques(lanes).has(pick.unique)) return lanes;
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
) => {
  const receiver = lanes.find((lane) => lane.id === laneId);
  if (!receiver?.teamId) return lanes;
  if (receiver.playersIn.some((item) => item.playerId === player.playerId)) {
    return lanes;
  }
  const withPlayer = lanes.map((lane) =>
    lane.id === laneId
      ? { ...lane, playersIn: [...lane.playersIn, player] }
      : lane,
  );
  if (!player.fromTeamId) return withPlayer;
  return ensureClubLane(player.fromTeamId, withPlayer);
};

export const addAssetsToLane = (
  lanes: TradeLane[],
  laneId: string,
  picks: DraftPicksDataType[],
  players: TradeLanePlayer[],
) => {
  let next = lanes;
  picks.forEach((pick) => {
    next = addPickToLane(next, laneId, pick);
  });
  players.forEach((player) => {
    next = addPlayerToLane(next, laneId, player);
  });
  return next;
};

export const removePickFromLane = (
  lanes: TradeLane[],
  laneId: string,
  unique: string,
) =>
  lanes.map((lane) =>
    lane.id === laneId
      ? {
          ...lane,
          picksIn: lane.picksIn.filter((pick) => pick.unique !== unique),
        }
      : lane,
  );

export const removePlayerFromLane = (
  lanes: TradeLane[],
  laneId: string,
  playerId: string,
) =>
  lanes.map((lane) =>
    lane.id === laneId
      ? {
          ...lane,
          playersIn: lane.playersIn.filter(
            (player) => player.playerId !== playerId,
          ),
        }
      : lane,
  );

export const formatPoints = (value: number) =>
  value.toLocaleString("en-AU", { maximumFractionDigits: 1 });

export const formatSignedPoints = (value: number) => {
  const formatted = formatPoints(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`;
  return "0";
};

export const pointsLabel = (value: number | null) =>
  value === null ? "" : formatPoints(value);

export const teamById = (teams: TeamType[]) =>
  new Map(teams.map((team) => [String(team.id), team]));

export const teamLabel = (
  teams: Map<string, TeamType>,
  teamId: string,
  fallback = "Club",
) => teams.get(teamId)?.teamNames || fallback;

export const teamShortLabel = (
  teams: Map<string, TeamType>,
  teamId: string,
) => teams.get(teamId)?.shortName || teams.get(teamId)?.teamNames || "Club";

export const pickPointsByUnique = (picks: DraftPicksDataType[]) => {
  const points = new Map<string, number | null>();
  picks.forEach((pick) => points.set(pick.unique, pick.points));
  return points;
};

export const impactTeamForLane = (
  impact: TradeImpactResponse | null,
  teamId: string,
) =>
  impact?.teams.find((team) => String(team.teamId) === teamId) ?? null;

export const receiveRows = (
  lane: TradeLane,
  impactTeam: TradeImpactTeam | null,
): { picks: TradeAssetRow[]; players: TradeAssetRow[] } => ({
  picks: lane.picksIn.map((pick) => {
    const fromImpact = impactTeam?.picksIn.find(
      (item) => item.unique === pick.unique,
    );
    return {
      key: pick.unique,
      label: fromImpact?.display || pick.display,
      points: pick.points,
    };
  }),
  players: lane.playersIn.map((player) => {
    const fromImpact = impactTeam?.playersIn.find(
      (item) => item.playerId === player.playerId,
    );
    return {
      key: player.playerId,
      label: fromImpact?.playerName || player.playerName,
      points: null,
    };
  }),
});

export const giveRows = (
  impactTeam: TradeImpactTeam | null,
  points: Map<string, number | null>,
): { picks: TradeAssetRow[]; players: TradeAssetRow[] } => {
  if (!impactTeam) return { picks: [], players: [] };
  return {
    picks: impactTeam.picksOut.map((pick) => ({
      key: pick.unique || pick.display,
      label: pick.display || pick.pickName,
      points: points.get(pick.unique) ?? null,
    })),
    players: impactTeam.playersOut.map((player) => ({
      key: player.playerId,
      label: player.playerName,
      points: null,
    })),
  };
};

const pickLabel = (pick: unknown) => {
  if (typeof pick === "string" && pick.trim()) return pick.trim();
  if (typeof pick === "number") return String(pick);
  if (!pick || typeof pick !== "object") return "";
  const row = pick as Record<string, unknown>;
  if (typeof row.display === "string" && row.display.trim()) {
    return row.display.trim();
  }
  const name = row.pick_name ?? row.pickName ?? row.label;
  return typeof name === "string" && name.trim() ? name.trim() : "";
};

export const failingPickLabels = (checks: TradeValidityChecks) => {
  const labels: string[] = [];
  [checks.tradeBackRule, checks.pickExists, checks.picksMatch].forEach(
    (check) => {
      if (check.status !== "Fail") return;
      check.picks.forEach((pick) => {
        const label = pickLabel(pick);
        if (label && !labels.includes(label)) labels.push(label);
      });
    },
  );
  return labels;
};

const fallbackDescription = (validity: TradeValidity) => {
  if (validity === "Invalid") return "This trade can't be confirmed.";
  if (validity === "Warning") return "This trade needs a check.";
  return "Trade valid.";
};

export const tradeStatusModel = ({
  hasProject,
  ready,
  fetching,
  failed,
  impact,
}: {
  hasProject: boolean;
  ready: boolean;
  fetching: boolean;
  failed: boolean;
  impact: TradeImpactResponse | null;
}): TradeStatusModel => {
  if (!hasProject) {
    return { kind: "error", message: "Select a project before trading." };
  }
  if (!ready) return { kind: "idle", message: TRADE_IDLE };
  if (failed) return { kind: "error", message: TRADE_ERROR };
  if (!impact) {
    return {
      kind: fetching ? "checking" : "idle",
      message: fetching ? TRADE_CHECKING : TRADE_IDLE,
    };
  }
  return {
    kind: "result",
    validity: impact.summaryValidity,
    message:
      impact.summaryDescription || fallbackDescription(impact.summaryValidity),
    picks:
      impact.summaryValidity === "Invalid"
        ? failingPickLabels(impact.validityChecks)
        : [],
  };
};

const chipTone = (
  incoming: boolean,
  year: number,
  projectYear: number | null,
): TradeHandChip["tone"] => {
  if (incoming) return "incoming";
  if (projectYear !== null && year !== projectYear) return "future";
  return "held";
};

export const handAfterView = (
  team: TradeImpactTeam,
  projectYear: number | null,
  clubName: string,
): TradeHandView => {
  const years = new Map<number, TradeHandView["years"][number]>();
  team.handAfter.forEach((group) => {
    years.set(group.year, {
      year: group.year,
      points: group.points,
      chips: group.picks
        .map((pick, index) => ({
          key: `${group.year}-${pick.round}-${pick.pick}-${index}`,
          label: pick.display || pick.pickName,
          tone: chipTone(pick.incoming, group.year, projectYear),
        }))
        .filter((chip) => chip.label),
    });
  });

  const tradedWithoutYear: TradeHandChip[] = [];
  team.tradedOut.forEach((pick, index) => {
    if (!pick.display) return;
    if (pick.year === null) {
      tradedWithoutYear.push({
        key: `out-${pick.display}-${index}`,
        label: pick.display,
        tone: "traded",
      });
      return;
    }
    const existing = years.get(pick.year) ?? {
      year: pick.year,
      points: null,
      chips: [],
    };
    existing.chips.push({
      key: `out-${pick.year}-${pick.display}-${index}`,
      label: pick.display,
      tone: "traded",
    });
    years.set(pick.year, existing);
  });

  const received = team.playersIn.map((player) => `receives ${player.playerName}`);
  const given = team.playersOut.map((player) => `gives ${player.playerName}`);
  const playerBits = [...received, ...given].filter(Boolean);
  const playersLine = playerBits.length
    ? `${clubName} ${playerBits.join(", ")}.`
    : "";

  return {
    years: [...years.values()].sort((a, b) => a.year - b.year),
    playersLine,
    tradedWithoutYear,
  };
};

export const pickerClubGroups = (
  teams: TeamType[],
  lanes: TradeLane[],
  receiverTeamId: string,
) => {
  const inTradeIds = lanes
    .map((lane) => lane.teamId)
    .filter((teamId) => teamId && teamId !== receiverTeamId);
  const inTradeSet = new Set(inTradeIds);
  const clubs = teamById(teams);
  const inTrade = inTradeIds
    .map((teamId) => clubs.get(teamId))
    .filter((team): team is TeamType => Boolean(team));
  const other = teams
    .filter(
      (team) =>
        String(team.id) !== receiverTeamId && !inTradeSet.has(String(team.id)),
    )
    .sort((a, b) => a.shortName.localeCompare(b.shortName));
  return { inTrade, other };
};

export const clubHandByYear = (
  picks: DraftPicksDataType[],
  ownerId: string,
  projectYear: number | null,
) => {
  const byYear = new Map<number, DraftPicksDataType[]>();
  picks
    .filter(
      (pick) =>
        String(pick.currentOwner) === ownerId && pick.pickStatus !== "Used",
    )
    .forEach((pick) => {
      const list = byYear.get(pick.year) ?? [];
      list.push(pick);
      byYear.set(pick.year, list);
    });

  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, yearPicks]) => ({
      year,
      future: projectYear !== null && year !== projectYear,
      picks: [...yearPicks].sort((a, b) => a.overallPick - b.overallPick),
    }));
};

export const statusBoxClass = (model: TradeStatusModel) => {
  if (model.kind === "result" && model.validity === "Valid") {
    return "bg-success-surface text-success-foreground";
  }
  if (model.kind === "result" && model.validity === "Warning") {
    return "bg-warning-bg text-warning-text";
  }
  if (
    model.kind === "error" ||
    (model.kind === "result" && model.validity === "Invalid")
  ) {
    return "bg-destructive/10 text-destructive";
  }
  return "bg-muted text-muted-foreground";
};

export const statusMarkerClass = (model: TradeStatusModel) => {
  if (model.kind === "result" && model.validity === "Valid") {
    return "bg-success-foreground";
  }
  if (model.kind === "result" && model.validity === "Warning") {
    return "bg-warning-text";
  }
  return "bg-destructive";
};

export const statusMarker = (model: TradeStatusModel) => {
  if (model.kind === "result" && model.validity === "Valid") return "✓";
  if (model.kind === "result" && model.validity === "Warning") return "!";
  if (
    model.kind === "error" ||
    (model.kind === "result" && model.validity === "Invalid")
  ) {
    return "×";
  }
  return "";
};

export const handChipClass = (tone: TradeHandChip["tone"]) => {
  if (tone === "incoming") {
    return "border-success-foreground/30 bg-success-surface text-success-foreground";
  }
  if (tone === "traded") {
    return "border-border bg-card text-muted-foreground line-through";
  }
  if (tone === "future") {
    return "border-dashed border-border bg-card text-muted-foreground";
  }
  return "border-border bg-muted text-foreground";
};

export const netValueClass = (value: number) => {
  if (value > 0) return "text-success-foreground";
  if (value < 0) return "text-destructive";
  return "text-foreground";
};

export const actionRowClass = (isMobile: boolean) =>
  isMobile
    ? "flex shrink-0 gap-2 border-t border-border bg-card px-4 py-3"
    : "flex shrink-0 justify-end gap-2 border-t border-border bg-card px-5 py-3";

export const actionButtonClass = (isMobile: boolean) =>
  isMobile ? "h-10 flex-1" : "h-9 min-w-28";

export const addButtonLabel = (count: number) =>
  count > 0 ? `Add ${count}` : "Add";

export const activePickerClubId = (
  clubId: string,
  groups: { inTrade: TeamType[]; other: TeamType[] },
) => clubId || groups.inTrade[0]?.id || groups.other[0]?.id || "";

export const toggleSelectedPick = (
  current: Record<string, DraftPicksDataType>,
  pick: DraftPicksDataType,
  taken: Set<string>,
) => {
  if (taken.has(pick.unique)) return current;
  const next = { ...current };
  if (next[pick.unique]) delete next[pick.unique];
  else next[pick.unique] = pick;
  return next;
};

export const toggleSelectedPlayer = (
  current: Record<string, PlayerLookupType>,
  player: PlayerLookupType,
) => {
  const next = { ...current };
  if (next[player.playerId]) delete next[player.playerId];
  else next[player.playerId] = player;
  return next;
};

export const selectedAssetCount = (
  picks: Record<string, DraftPicksDataType>,
  players: Record<string, PlayerLookupType>,
) => Object.keys(picks).length + Object.keys(players).length;

export const playersForLane = (
  players: Record<string, PlayerLookupType>,
): TradeLanePlayer[] =>
  Object.values(players).map((player) => ({
    playerId: player.playerId,
    playerName: player.name,
    fromTeamId: player.teamId ?? "",
  }));

export const pickerHint = (count: number, tab: TradePickerTab) => {
  if (count > 0) return "";
  if (tab === "picks") {
    return "Tap picks to select. Switch clubs to add from more than one.";
  }
  return "Select the players this club receives.";
};

export const pickerPlayersMessage = ({
  loading,
  count,
  searching,
}: {
  loading: boolean;
  count: number;
  searching: boolean;
}) => {
  if (count > 0) return "";
  if (loading) return searching ? "Searching." : "Loading players.";
  return "No players found.";
};

export const filterChipClass = (selected: boolean) =>
  selected
    ? "h-[26px] rounded-md border border-foreground bg-foreground px-2.5 text-[11.5px] font-semibold text-background"
    : "h-[26px] rounded-md border border-border bg-card px-2.5 text-[11.5px] font-semibold text-foreground";

export const pickerGridClass = (isMobile: boolean) =>
  isMobile ? "grid grid-cols-3 gap-1" : "grid grid-cols-6 gap-1";

export const pickTileClass = ({
  taken,
  selected,
  future,
}: {
  taken: boolean;
  selected: boolean;
  future: boolean;
}) => {
  if (taken) {
    return "flex h-[34px] cursor-not-allowed flex-col items-center justify-center rounded-[5px] border border-border bg-muted opacity-40";
  }
  if (selected) {
    return "flex h-[34px] flex-col items-center justify-center rounded-[5px] border border-primary bg-primary-light";
  }
  if (future) {
    return "flex h-[34px] flex-col items-center justify-center rounded-[5px] border border-dashed border-border bg-card hover:border-primary";
  }
  return "flex h-[34px] flex-col items-center justify-center rounded-[5px] border border-border bg-muted hover:border-primary";
};

export const playerRowClass = (selected: boolean) =>
  selected
    ? "grid h-9 w-full grid-cols-[132px_minmax(0,1fr)_80px] items-center gap-2.5 border-t border-primary bg-primary-light text-left text-xs"
    : "grid h-9 w-full grid-cols-[132px_minmax(0,1fr)_80px] items-center gap-2.5 border-t border-border text-left text-xs hover:bg-muted";

export const pickTilePoints = (taken: boolean, points: number | null) => {
  if (taken) return "In trade";
  const label = pointsLabel(points);
  return label ? `${label} pts` : "";
};
