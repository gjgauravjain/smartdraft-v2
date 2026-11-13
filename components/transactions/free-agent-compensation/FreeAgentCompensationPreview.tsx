"use client";

import { TeamType } from "@/app/api/type/common";
import { FreeAgentCompensationImpact } from "@/app/api/type/free-agent-compensation";
import { Check } from "lucide-react";
import { FreeAgentCompensationStatusView } from "./type";
import {
  FREE_AGENT_IDLE,
  chipGridClass,
  formatDraftPoints,
  formatImpactChange,
  pickChipClass,
  yearLabel,
} from "./util";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PreviewProps = {
  status: FreeAgentCompensationStatusView;
  team: TeamType | null;
  draftYear: number | null;
  isMobile: boolean;
};

export const FreeAgentCompensationPreview = ({
  status,
  team,
  draftYear,
  isMobile,
}: PreviewProps) => {
  if (status.kind === "loading") {
    return <StatusLine>Checking the impact…</StatusLine>;
  }
  if (status.kind === "field") {
    return <ErrorLine messages={status.messages} />;
  }
  if (status.kind === "server") {
    return <ErrorLine messages={[status.message]} />;
  }
  if (status.kind === "success") {
    return (
      <SuccessPreview
        impact={status.impact}
        team={team}
        draftYear={draftYear}
        isMobile={isMobile}
      />
    );
  }
  return <StatusLine>{FREE_AGENT_IDLE}</StatusLine>;
};

const StatusLine = ({ children }: { children: string }) => {
  return (
    <p className="text-[13px] leading-snug text-muted-foreground">{children}</p>
  );
};

const ErrorLine = ({ messages }: { messages: string[] }) => {
  return (
    <div className="grid grid-cols-[18px_1fr] items-start gap-2 text-[13px] leading-snug text-destructive">
      <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-destructive text-[11px] font-bold text-white">
        !
      </span>
      <span>
        {messages.map((message) => (
          <span key={message} className="block">
            {message}
          </span>
        ))}
      </span>
    </div>
  );
};

const SuccessPreview = ({
  impact,
  team,
  draftYear,
  isMobile,
}: {
  impact: FreeAgentCompensationImpact;
  team: TeamType | null;
  draftYear: number | null;
  isMobile: boolean;
}) => {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3.5">
      <div className="grid grid-cols-[18px_1fr] items-start gap-2 text-[13px] leading-snug text-success">
        <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-success text-[11px] font-bold text-white">
          <Check className="h-3 w-3" />
        </span>
        <span>{impact.impactDescription}</span>
      </div>
      <DraftPoints impact={impact} />
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <ClubBadge shortName={team?.shortName} />
            <span className="truncate text-[12px] font-semibold text-foreground">
              {team?.teamNames ?? "Club"} picks after
            </span>
          </span>
          <HoverHint isMobile={isMobile} />
        </div>
        <div className="flex flex-col gap-2">
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
    </div>
  );
};

const DraftPoints = ({ impact }: { impact: FreeAgentCompensationImpact }) => {
  const start = impact.teamDraftPointsStart;
  const end = impact.teamDraftPointsEnd;
  const change = impact.teamDraftPointsImpact;

  return (
    <div className="flex items-baseline justify-between gap-3 text-[13px]">
      <span className="text-[12px] font-semibold text-muted-foreground">
        Draft points
      </span>
      <span className="tabular-nums text-foreground">
        {start === null ? "—" : formatDraftPoints(start)} →{" "}
        <b>{end === null ? "—" : formatDraftPoints(end)}</b>
        {change === null ? null : (
          <span className="ml-1.5 font-semibold text-success">
            {formatImpactChange(change)}
          </span>
        )}
      </span>
    </div>
  );
};

const ClubBadge = ({ shortName }: { shortName?: string }) => {
  if (!shortName) return null;
  return (
    <span className="inline-grid h-5 min-w-7.5 shrink-0 place-items-center rounded-full border border-border bg-secondary px-1 text-[9.5px] font-extrabold tracking-wide text-foreground">
      {shortName}
    </span>
  );
};

const HoverHint = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) return null;
  return (
    <span className="shrink-0 text-[11px] text-muted-foreground">
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
  picks: FreeAgentCompensationImpact["currentYearPicks"];
  future: boolean;
  isMobile: boolean;
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1">
      <span className="text-[12px] font-bold text-foreground">{year}</span>
      <span className="justify-self-end text-[12px] tabular-nums text-foreground">
        <b>{points === null ? "—" : formatDraftPoints(points)}</b> pts
      </span>
      <div className={chipGridClass(isMobile)}>
        {picks.map((pick, index) => (
          <Tooltip key={`${year}-${pick.pick}-${index}`}>
            <TooltipTrigger>
              <span
                key={`${year}-${pick.pick}-${index}`}
                title={pick.pickName}
                className={`grid h-7 place-items-center rounded-md border text-[11px] ${pickChipClass(pick, future)}`}
              >
                {pick.pick}
              </span>
            </TooltipTrigger>
            <TooltipContent>{pick.pickName}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
