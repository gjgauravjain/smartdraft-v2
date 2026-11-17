"use client";

import { TradeStatusModel } from "./type";
import { statusBoxClass, statusMarker, statusMarkerClass } from "./util";

type TradeTeamStatusProps = {
  status: TradeStatusModel;
};

export const TradeTeamStatus = ({ status }: TradeTeamStatusProps) => {
  const marker = statusMarker(status);
  const idle = status.kind === "idle" || status.kind === "checking";

  return (
    <div
      className={`mt-3 grid items-start gap-2 rounded-lg px-3 py-2 text-[12.5px] leading-normal ${statusBoxClass(status)} ${idle ? "grid-cols-1" : "grid-cols-[16px_minmax(0,1fr)]"}`}
    >
      {marker ? (
        <span
          className={`mt-px grid size-4 place-items-center rounded-full text-[10px] font-extrabold text-white ${statusMarkerClass(status)}`}
        >
          {marker}
        </span>
      ) : null}
      <div>
        <span className="font-semibold">{status.message}</span>
        {status.kind === "result" && status.picks.length ? (
          <span className="mt-1 flex flex-wrap gap-1">
            {status.picks.map((pick) => (
              <span
                key={pick}
                className="inline-block max-w-33 truncate rounded-md border border-current/20 bg-card px-1.5 text-[11px] leading-5 font-semibold text-foreground"
              >
                {pick}
              </span>
            ))}
          </span>
        ) : null}
      </div>
    </div>
  );
};
