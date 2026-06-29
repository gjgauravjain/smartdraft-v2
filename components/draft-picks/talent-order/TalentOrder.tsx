import React, { useState } from "react";
import { useTalentOrder } from "./useTalentOrder";
import { PlayerDatabaseType } from "@/app/api/type/player";
import { FILTERS } from "./util";

type TalentOrderProps = {
  players: PlayerDatabaseType[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  topOffset?: number;
};

const TalentOrder: React.FC<TalentOrderProps> = ({
  players,
  isCollapsed: isCollapsedProp,
  onToggleCollapse,
  topOffset = 0,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = isCollapsedProp !== undefined;
  const isCollapsed = isControlled ? isCollapsedProp : internalCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    }
    if (!isControlled) {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const { playerList, filter, setFilter, totalCount, remainingCount } =
    useTalentOrder(players);

  if (isCollapsed) {
    return (
      <div
        className="fixed right-0 z-30 font-sans"
        style={{ top: topOffset, bottom: 0 }}
      >
        <div
          role="button"
          tabIndex={0}
          title="Expand talent order"
          aria-label="Expand talent order"
          onClick={toggleCollapse}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleCollapse();
            }
          }}
          className="w-8 h-full shrink-0 bg-background border-l border-border flex items-start justify-center pt-4 cursor-pointer hover:bg-muted transition-colors"
        >
          <div
            className="font-sans text-[10.5px] font-bold uppercase text-foreground select-none"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "1px",
            }}
          >
            ‹ Talent Order
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed right-0 z-30 flex font-sans"
      style={{ top: topOffset, bottom: 0 }}
    >
      <div className="bg-background border-l border-border flex flex-col h-full w-[264px] shrink-0">
        <div className="px-3.5 py-3 border-b border-border flex items-center gap-2 shrink-0">
          <div className="flex-1">
            <div className="text-[12.5px] font-bold text-foreground">
              Talent Order
            </div>
            <div className="text-[10.5px] text-muted-foreground">
              Recruiting board · {remainingCount} of {totalCount} remaining
            </div>
          </div>
          <button
            type="button"
            title="Collapse talent order"
            aria-label="Collapse talent order"
            onClick={toggleCollapse}
            className="w-[22px] h-[22px] bg-transparent border border-border rounded text-muted-foreground text-xs cursor-pointer flex items-center justify-center p-0 hover:bg-muted transition-colors shrink-0"
          >
            ›
          </button>
        </div>

        <div className="px-3 pt-2 pb-1 shrink-0 flex gap-1">
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={[
                  "flex-1 px-2 py-[5px] text-[10.5px] font-semibold rounded-[5px] border cursor-pointer transition-colors",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1.5 flex flex-col gap-1">
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
      </div>
    </div>
  );
};

export default TalentOrder;
