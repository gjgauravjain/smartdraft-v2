import { TradeImpactTeam } from "@/app/api/type/trade";
import { cn } from "@/lib/utils";
import { formatPoints } from "../util";

export const ClubInOut = ({
  team,
  align,
}: {
  team: TradeImpactTeam;
  align: "left" | "right";
}) => (
  <div
    className={cn(
      "shrink-0 text-[10.5px] tabular-nums text-muted-foreground",
      align === "right" ? "text-right" : "text-left",
    )}
  >
    in{" "}
    <strong className="text-foreground/80">{formatPoints(team.ptsIn)}</strong>
    <br />
    out{" "}
    <strong className="text-foreground/80">{formatPoints(team.ptsOut)}</strong>
  </div>
);
