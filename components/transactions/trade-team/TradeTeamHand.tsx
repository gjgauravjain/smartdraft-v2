"use client";

import { TeamType } from "@/app/api/type/common";
import { TradeImpactResponse } from "@/app/api/type/trade";
import { TradeTeamHandChip } from "./commonTradeComponent/TradeTeamHandChip";
import { formatPoints, handAfterView, teamLabel } from "./util";
import { cn } from "@/lib/utils";

type TradeTeamHandProps = {
  impact: TradeImpactResponse | null;
  teams: Map<string, TeamType>;
  projectYear: number | null;
  open: boolean;
  teamId: string;
  isMobile: boolean;
  onToggle: () => void;
  onTeam: (teamId: string) => void;
};

export const TradeTeamHand = ({
  impact,
  teams,
  projectYear,
  open,
  teamId,
  isMobile,
  onToggle,
  onTeam,
}: TradeTeamHandProps) => {
  if (!impact) return null;
  const clubs = impact.teams.filter((team) => team.teamId);
  if (!clubs.length) return null;
  const activeId = clubs.some((team) => String(team.teamId) === teamId)
    ? teamId
    : String(clubs[0].teamId);
  const active = clubs.find((team) => String(team.teamId) === activeId);
  const hand = active
    ? handAfterView(active, projectYear, teamLabel(teams, activeId))
    : null;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={onToggle}
        className="text-xs font-semibold text-primary"
      >
        {open ? "Hide picks after trade" : "Show picks after trade"}
      </button>
      {open && hand ? (
        <div className="mt-2">
          <div className="mb-2 flex flex-wrap gap-1">
            {clubs.map((team) => {
              const id = String(team.teamId);
              const selected = id === activeId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTeam(id)}
                  className={cn(
                    "h-6.5 rounded-md border border-border bg-card px-2.5 text-[11.5px] font-semibold text-foreground",
                    selected &&
                      "border-foreground bg-foreground text-background",
                  )}
                >
                  {teams.get(id)?.shortName || team.teamName}
                </button>
              );
            })}
          </div>
          {hand.playersLine ? (
            <p className="mb-1.5 text-[11.5px] leading-normal text-muted-foreground">
              {hand.playersLine}
            </p>
          ) : null}
          <div className="border-t border-border">
            {hand.years.map((year) => (
              <div
                key={year.year}
                className="grid grid-cols-1 gap-1 border-b border-border py-1.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-foreground">
                    {year.year}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground tabular-nums">
                    {year.points === null ? (
                      ""
                    ) : (
                      <>
                        <b className="font-semibold text-foreground">
                          {formatPoints(year.points)}
                        </b>{" "}
                        pts
                      </>
                    )}
                  </span>
                </div>
                <div
                  className={
                    isMobile
                      ? "grid grid-cols-3 gap-1"
                      : "grid grid-cols-6 gap-1"
                  }
                >
                  {year.chips.map((chip) => (
                    <TradeTeamHandChip key={chip.key} chip={chip} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {hand.tradedWithoutYear.length ? (
            <div
              className={
                isMobile
                  ? "mt-2 grid grid-cols-3 gap-1"
                  : "mt-2 grid grid-cols-6 gap-1"
              }
            >
              {hand.tradedWithoutYear.map((chip) => (
                <TradeTeamHandChip key={chip.key} chip={chip} />
              ))}
            </div>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3.5 w-7 rounded-lg border border-success-foreground/30 bg-success-surface" />
              Received
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3.5 w-7 rounded-lg border border-border bg-card line-through" />
              Traded out
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};