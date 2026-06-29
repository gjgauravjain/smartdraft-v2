import {
  PlayerDatabaseType,
  TalentFilter,
  TalentOrderRow,
} from "@/app/api/type/player";

const POSITION_LABELS: Record<string, string> = {
  mid: "MID",
  ruck: "RUCK",
  keyfwd: "KEY F",
  keydef: "KEY D",
  genfwd: "MID/F",
  gendef: "HBF",
  wing: "WING",
};

export const FILTERS: { key: TalentFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "available", label: "Available" },
  { key: "drafted", label: "Drafted" },
];

function normalisePosition(raw: string | null | undefined): string {
  if (!raw) return "—";
  const key = raw.trim().toLowerCase();
  return POSITION_LABELS[key] ?? raw.toUpperCase();
}

function preferredName(p: PlayerDatabaseType): string {
  const first = p.preferredFirstName?.trim() || p.firstName;
  const last = p.preferredLastName?.trim() || p.lastName;
  return `${first} ${last}`.trim();
}

function clubFromJuniorTeam(raw: string | null | undefined): string {
  if (!raw || raw.trim().toUpperCase() === "NA") return "Unattached";
  const segments = raw.split("/").map((s) => s.trim());
  return segments[segments.length - 1] || raw;
}

export function shapePlayer(
  p: PlayerDatabaseType,
  rank: number,
): TalentOrderRow {
  const state = p.state && p.state.toUpperCase() !== "UNKNOWN" ? p.state : null;
  return {
    id: p.id,
    rank,
    name: preferredName(p),
    club: clubFromJuniorTeam(p.juniorTeam),
    state,
    positionLabel: normalisePosition(p.position),
    status: p.currentAflActive ? "drafted" : "available",
  };
}
