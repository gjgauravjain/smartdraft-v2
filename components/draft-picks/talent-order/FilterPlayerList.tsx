import React from "react";
import { TalentOrderRow } from "@/app/api/type/player";
import { cn } from "@/lib/utils";

interface FilterPlayerListProps {
  playerList: TalentOrderRow[];
  className?: string;
}

const FilterPlayerList = ({ playerList, className }: FilterPlayerListProps) => {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-y-auto px-2.5 pb-2.5 pt-1.5 flex flex-col gap-1",
        className,
      )}
    >
      {playerList.length === 0 ? (
        <div className="text-[11px] text-muted-foreground text-center py-6">
          No players match this filter.
        </div>
      ) : (
        playerList.map((row) => {
          const isDrafted = row.status === "drafted";
          return (
            <div
              key={row.id}
              className={[
                "flex items-center gap-2 px-[9px] py-[7px] border rounded-[6px] transition-colors",
                isDrafted
                  ? "bg-muted border-border opacity-60"
                  : "bg-card border-border opacity-100 hover:bg-muted/50 cursor-pointer",
              ].join(" ")}
            >
              <div
                className={[
                  "w-[22px] h-[22px] rounded shrink-0 flex items-center justify-center text-[11px] font-bold tabular-nums",
                  isDrafted
                    ? "bg-muted-foreground/50 text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                ].join(" ")}
              >
                {row.rank}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={[
                    "text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis",
                    isDrafted ? "text-muted-foreground" : "text-foreground",
                  ].join(" ")}
                >
                  {row.name}
                </div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
                  {isDrafted ? (
                    <>
                      <span>Drafted</span>
                      <span
                        aria-hidden
                        className="w-[11px] h-[11px] rounded-full bg-muted-foreground/40 border border-black/10 shrink-0"
                      />
                      <span className="font-bold">{row.club}</span>
                    </>
                  ) : (
                    <span>
                      {row.club}
                      {row.state ? ` · ${row.state}` : ""}
                    </span>
                  )}
                </div>
              </div>

              <div
                className={[
                  "px-[5px] py-[1px] rounded-[3px] text-[9px] font-bold shrink-0",
                  isDrafted
                    ? "bg-muted-foreground/50 text-primary-foreground"
                    : "bg-primary text-primary-foreground",
                ].join(" ")}
              >
                {row.positionLabel}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FilterPlayerList;
