"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { DraftYearList } from "@/app/api/type/draftpicks";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { formatPlayerName, isPlayerName } from "./util";
import { PiInfoThin } from "react-icons/pi";

interface DraftRoundColumnProps {
  title: string;
  picks: DraftYearList[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  userTeamId?: number | string;
  hoveredTeamId?: number | string | null;
  className?: string;
}

export function DraftRoundColumn({
  title,
  picks,
  collapsed,
  onToggleCollapse,
  userTeamId,
  hoveredTeamId,
  className,
}: DraftRoundColumnProps) {
  if (collapsed) {
    return (
      <section
        className={cn(
          "flex min-h-[calc(100vh-14rem)] shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mx-auto mt-3 h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={`Expand ${title}`}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex flex-1 items-end justify-center px-2 py-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="[writing-mode:vertical-rl] rotate-180 text-sm font-bold tracking-wide">
            {title}{" "}
            <span className="mt-3 [writing-mode:vertical-rl] rotate-180 text-xs font-semibold">
              {picks.length} picks
            </span>
          </span>
        </button>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "flex h-[calc(100vh-178px)] w-60 shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex py-2.5 px-3 items-center justify-between border-b border-border">
        <div>
          <h3 className="text-xs font-bold leading-tight text-foreground">
            {title}
          </h3>
          <p className="text-[10px] font-semibold text-muted-foreground">
            {picks.length} picks
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label={`Collapse ${title}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[2.75rem_5.5rem_minmax(0,1fr)] items-center border-b border-border bg-table-header py-1.25 px-3 text-[9px] font-bold uppercase tracking-wider text-text4">
        <span>#</span>
        <span>Team</span>
        <span className="text-right">Player / Pts</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {picks.length ? (
          picks.map((pick) => {
            const belongsToUserTeam =
              userTeamId !== undefined &&
              Number(pick.teamId) === Number(userTeamId);
            const isHoveredTeam =
              hoveredTeamId !== undefined &&
              Number(pick.teamId) === Number(hoveredTeamId);
            const dimForHover = hoveredTeamId && !isHoveredTeam;
            const hasOwnerNote =
              pick.currentOwnerShort !== pick.displayNameShort || !!pick.reason;
            const hasPlayer = isPlayerName(pick.pointPlayer);

            return (
              <div
                key={`${pick.draftRound}-${pick.overallPick}-${pick.id}`}
                className={cn(
                  "grid grid-cols-[2.75rem_5.5rem_minmax(0,1fr)] items-center border-b border-border/70 bg-card px-3 py-1.75 text-xs text-foreground transition-colors",
                  (belongsToUserTeam || isHoveredTeam) &&
                    "bg-highlight-background",
                  dimForHover && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-bold tabular-nums",
                    belongsToUserTeam
                      ? "text-highlight-text"
                      : "text-foreground",
                  )}
                >
                  {pick.overallPick}{" "}
                </span>
                <div className="flex min-w-0 items-center gap-2">
                  {pick.image ? (
                    <img
                      src={pick.image}
                      alt={pick.currentOwnerShort}
                      className="h-6 w-6 shrink-0 rounded-full border border-border"
                    />
                  ) : (
                    <span className="h-6 w-6 shrink-0 rounded-full border border-border bg-muted" />
                  )}
                  <span
                    className={cn(
                      "truncate text-xs font-normal",
                      belongsToUserTeam
                        ? "text-highlight-text"
                        : "text-muted-foreground",
                    )}
                  >
                    {pick.currentOwnerShort}
                  </span>
                  {hasOwnerNote && (
                    <Tooltip>
                      <TooltipTrigger>
                        <PiInfoThin className="shrink-0 cursor-pointer text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {pick.reason}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="min-w-0 text-right">
                  {hasPlayer ? (
                    <Chip title={pick.pointPlayer} variant="success">
                      {formatPlayerName(pick.pointPlayer)}
                    </Chip>
                  ) : (
                    <span className="font-normal text-muted-foreground">
                      {pick.pointPlayer || pick.aflPointValue}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-32 items-center justify-center px-4 text-sm text-muted-foreground">
            No picks available.
          </div>
        )}
      </div>
    </section>
  );
}
