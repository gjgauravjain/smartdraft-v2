"use client";

import { TeamType } from "@/app/api/type/common";
import { ApplyCompensationRow } from "./ApplyCompensationRow";
import { ApplyCompensationView } from "./type";
import {
  APPLY_COMPENSATION_EMPTY,
  APPLY_COMPENSATION_INTRO,
  APPLY_COMPENSATION_LOADING,
} from "./util";

type ApplyCompensationBodyProps = {
  view: ApplyCompensationView;
  teams: TeamType[];
};

export const ApplyCompensationBody = ({
  view,
  teams,
}: ApplyCompensationBodyProps) => {
  if (view.kind === "loading") return <LoadingState />;
  if (view.kind === "error") return <ErrorLine messages={view.messages} />;
  if (view.kind === "empty") return <IdleLine message={APPLY_COMPENSATION_EMPTY} />;

  return (
    <>
      <p className="text-[12.5px] leading-normal text-foreground">
        {APPLY_COMPENSATION_INTRO}
      </p>
      <div className="border-t border-border">
        {view.picks.map((pick, index) => (
          <ApplyCompensationRow
            key={`${pick.teamId ?? "club"}-${pick.label}-${index}`}
            pick={pick}
            teams={teams}
          />
        ))}
      </div>
      <ErrorLine messages={view.saveError} />
    </>
  );
};

const LoadingState = () => {
  return (
    <>
      <IdleLine message={APPLY_COMPENSATION_LOADING} />
      <div className="border-t border-border">
        <div className="flex h-16 flex-col justify-center gap-1.5 border-b border-border">
          <span className="block h-2.5 w-2/5 rounded bg-muted" />
          <span className="block h-2.5 w-[70%] rounded bg-muted" />
        </div>
        <div className="flex h-16 flex-col justify-center gap-1.5 border-b border-border">
          <span className="block h-2.5 w-2/5 rounded bg-muted" />
          <span className="block h-2.5 w-[70%] rounded bg-muted" />
        </div>
      </div>
    </>
  );
};

const IdleLine = ({ message }: { message: string }) => {
  return (
    <div className="rounded-lg bg-muted px-3 py-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
      {message}
    </div>
  );
};

const ErrorLine = ({ messages }: { messages: string[] }) => {
  if (!messages.length) return null;

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
