import { TradeImpactTeam } from "@/app/api/type/trade";
import { formatPoints } from "./util";
import { cn } from "@/lib/utils";

export const AssetRow = ({
  label,
  picks,
  players,
  points,
  incoming = false,
}: {
  label: string;
  picks: TradeImpactTeam["picksIn"];
  players: TradeImpactTeam["playersIn"];
  points: number;
  incoming?: boolean;
}) => (
  <div className="grid grid-cols-[26px_minmax(0,1fr)_auto] items-start gap-2">
    <span className="pt-1 text-[9.5px] font-extrabold uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
    <div className="flex min-w-0 flex-wrap gap-1.5 overflow-hidden">
      {picks.map((pick) => (
        <span
          key={pick.unique}
          className={cn(
            "inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 rounded-full px-[9px] text-[11px] font-bold tabular-nums",
            incoming
              ? "border border-primary-text bg-primary text-white"
              : "border border-border bg-muted text-foreground/80",
          )}
        >
          {incoming ? (
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-white" />
          ) : null}
          <span className="min-w-0 truncate">{pick.pickName}</span>
        </span>
      ))}
      {players.map((player) => (
        <span
          key={player.playerId}
          className={cn(
            "inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 rounded-full px-[9px] text-[11px] font-bold",
            incoming
              ? "border border-highlight-text bg-highlight-text text-white"
              : "border border-border bg-muted text-foreground/80",
          )}
        >
          {incoming ? (
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-white" />
          ) : null}
          <span className="min-w-0 truncate">{player.playerName}</span>
        </span>
      ))}
      {!picks.length && !players.length ? (
        <span className="text-[11px] italic text-muted-foreground">None</span>
      ) : null}
    </div>
    <span className="shrink-0 whitespace-nowrap pt-1 text-[10.5px] tabular-nums text-muted-foreground">
      <strong className="font-bold text-foreground/80">
        {formatPoints(points)}
      </strong>{" "}
      pts
    </span>
  </div>
);
