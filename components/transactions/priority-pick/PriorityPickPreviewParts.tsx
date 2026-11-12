"use client";

import {
  PriorityPickHandPick,
  PriorityPickImpact,
} from "@/app/api/type/priority-pick";
import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PriorityPickStatusView } from "./type";
import {
  chipClass,
  chipGridClass,
  formatDraftPoints,
  formatImpactChange,
  PRIORITY_PICK_IDLE,
  yearLabel,
} from "./util";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const StatusLine = ({ status }: { status: PriorityPickStatusView }) => {
  if (status.kind === "loading") {
    return <IdleLine message="Checking the impact…" />;
  }
  if (status.kind === "field") {
    return <ErrorLine messages={status.messages} />;
  }
  if (status.kind === "server") {
    return <ErrorLine messages={[status.message]} />;
  }
  return <IdleLine message={PRIORITY_PICK_IDLE} />;
};

export const IdleLine = ({ message }: { message: string }) => {
  return (
    <div className="rounded-lg bg-muted px-3 py-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
      {message}
    </div>
  );
};

export const ErrorLine = ({ messages }: { messages: string[] }) => {
  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-destructive">
      <span className="mt-px grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] font-extrabold text-white">
        !
      </span>
      <span>
        {messages.map((message, index) => (
          <span key={`${message}-${index}`} className="block">
            {message}
          </span>
        ))}
      </span>
    </div>
  );
};

export const SuccessLine = ({ message }: { message: string }) => {
  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 rounded-lg bg-success-surface px-3 py-2.5 text-[12.5px] leading-relaxed text-foreground">
      <span className="mt-px grid h-4 w-4 place-items-center rounded-full bg-success-foreground text-card">
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      <span>{message}</span>
    </div>
  );
};

export const DraftPointsLine = ({ impact }: { impact: PriorityPickImpact }) => {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        Draft points
      </span>
      <span className="text-right tabular-nums text-foreground">
        <DraftPoint value={impact.teamDraftPointsStart} />
        <span> → </span>
        <b className="font-bold">
          <DraftPoint value={impact.teamDraftPointsEnd} />
        </b>
        <ImpactChange value={impact.teamDraftPointsImpact} />
      </span>
    </div>
  );
};

const DraftPoint = ({ value }: { value: number | null }) => {
  if (value === null) return null;
  return <>{formatDraftPoints(value)}</>;
};

const ImpactChange = ({ value }: { value: number | null }) => {
  if (value === null) return null;
  return (
    <span className="ml-1.5 font-bold text-success-foreground">
      {formatImpactChange(value)}
    </span>
  );
};

export const PickHand = ({
  impact,
  team,
  draftYear,
  isMobile,
}: {
  impact: PriorityPickImpact;
  team: TeamType | null;
  draftYear: number | null;
  isMobile: boolean;
}) => {
  return (
    <div>
      <HandHeader team={team} showHint={!isMobile} />
      <div className="border-t border-border">
        <YearRow
          year={yearLabel(draftYear, 0)}
          points={impact.currentYearPicksPts}
          picks={impact.currentYearPicks}
          future={false}
          isMobile={isMobile}
        />
        <YearRow
          year={yearLabel(draftYear, 1)}
          points={impact.nextYearPicksPts}
          picks={impact.nextYearPicks}
          future
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

const HandHeader = ({
  team,
  showHint,
}: {
  team: TeamType | null;
  showHint: boolean;
}) => {
  if (!team) return null;

  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <span className="inline-grid h-5 min-w-7.5 shrink-0 place-items-center rounded-full border border-border bg-secondary px-1 text-[9.5px] font-extrabold tracking-wide text-foreground">
          {team.shortName}
        </span>
        <span className="truncate text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {team.teamNames} picks after
        </span>
      </span>
      <HandHint show={showHint} />
    </div>
  );
};

const HandHint = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <span className="shrink-0 text-[11.5px] text-muted-foreground">
      Hover a pick for its full name
    </span>
  );
};

const YearRow = ({
  year,
  points,
  picks,
  future,
  isMobile,
}: {
  year: string;
  points: number | null;
  picks: PriorityPickHandPick[];
  future: boolean;
  isMobile: boolean;
}) => {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 gap-y-1 border-b border-border py-1.5">
      <span className="text-xs font-bold leading-4.5 text-foreground">
        {year}
      </span>
      <YearPoints points={points} />
      <div className={cn("col-span-2", chipGridClass(isMobile))}>
        {picks.map((pick, index) => (
          <PickChip
            key={`${year}-${pick.pick}-${index}`}
            pick={pick}
            future={future}
          />
        ))}
      </div>
    </div>
  );
};

const YearPoints = ({ points }: { points: number | null }) => {
  if (points === null) return <span />;
  return (
    <span className="text-right text-[11.5px] tabular-nums leading-4.5 text-muted-foreground">
      <b className="font-semibold text-foreground">
        {formatDraftPoints(points)}
      </b>{" "}
      pts
    </span>
  );
};

const PickChip = ({
  pick,
  future,
}: {
  pick: PriorityPickHandPick;
  future: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span
          className={cn(
            "block h-6 truncate rounded-[5px] border px-1 text-center text-[11px] leading-5.5 sm:text-[11.5px]",
            chipClass(pick, future),
          )}
        >
          {pick.pick}
        </span>
      </TooltipTrigger>
      <TooltipContent>{pick.pickName}</TooltipContent>
    </Tooltip>
  );
};
