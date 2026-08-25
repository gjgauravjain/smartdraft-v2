import { TradeAsset, TradeClub } from "./types";

export const tradePickOptions: TradeAsset[] = [
  {
    id: "pick-1",
    name: "Pick 1",
    label: "Pick 1",
    kind: "pick",
    points: 350,
    clubId: "brisbane",
  },
  {
    id: "pick-2",
    name: "Pick 7",
    label: "Pick 7",
    kind: "pick",
    points: 220,
    clubId: "brisbane",
  },
  {
    id: "pick-3",
    name: "Pick 13",
    label: "Pick 13",
    kind: "pick",
    points: 180,
    clubId: "collingwood",
  },
  {
    id: "pick-4",
    name: "Pick 18",
    label: "Pick 18",
    kind: "pick",
    points: 140,
    clubId: "sydney",
  },
  {
    id: "pick-5",
    name: "Pick 24",
    label: "Pick 24",
    kind: "pick",
    points: 95,
    clubId: "essendon",
  },
  {
    id: "pick-6",
    name: "Pick 32",
    label: "Pick 32",
    kind: "pick",
    points: 70,
    clubId: "geelong",
  },
  {
    id: "pick-7",
    name: "Pick 40",
    label: "Pick 40",
    kind: "pick",
    points: 50,
    clubId: "carlton",
  },
  {
    id: "pick-8",
    name: "Pick 55",
    label: "Pick 55",
    kind: "pick",
    points: 35,
    clubId: "hawthorn",
  },
];

export const tradePlayerOptions: TradeAsset[] = [
  {
    id: "player-1",
    name: "Jake Stringer",
    label: "Jake Stringer",
    kind: "player",
    points: 120,
    clubId: "essendon",
  },
  {
    id: "player-2",
    name: "Charlie Cameron",
    label: "Charlie Cameron",
    kind: "player",
    points: 95,
    clubId: "brisbane",
  },
  {
    id: "player-3",
    name: "Tom Mitchell",
    label: "Tom Mitchell",
    kind: "player",
    points: 75,
    clubId: "collingwood",
  },
  {
    id: "player-4",
    name: "Isaac Heeney",
    label: "Isaac Heeney",
    kind: "player",
    points: 88,
    clubId: "sydney",
  },
  {
    id: "player-5",
    name: "Max Gawn",
    label: "Max Gawn",
    kind: "player",
    points: 82,
    clubId: "melbourne",
  },
  {
    id: "player-6",
    name: "Sam Docherty",
    label: "Sam Docherty",
    kind: "player",
    points: 55,
    clubId: "carlton",
  },
  {
    id: "player-7",
    name: "Tom Hawkins",
    label: "Tom Hawkins",
    kind: "player",
    points: 60,
    clubId: "geelong",
  },
  {
    id: "player-8",
    name: "Mitch Lewis",
    label: "Mitch Lewis",
    kind: "player",
    points: 62,
    clubId: "hawthorn",
  },
];

export const getTradeClubByTeam = (clubs: TradeClub[], teamId: string) =>
  clubs.find((club) => club.teamId === teamId);

export const getTradeAssetPoints = (asset: TradeAsset) => asset.points;

export const getClubPointsIn = (club: TradeClub) =>
  [...club.picks, ...club.players].reduce(
    (sum, asset) => sum + getTradeAssetPoints(asset),
    0,
  );

export const getTradeSummaryPoints = (clubs: TradeClub[]) =>
  clubs.map((club) => ({
    clubId: club.id,
    teamId: club.teamId,
    name: club.name,
    pointsIn: getClubPointsIn(club),
    pointsOut: 0,
  }));
