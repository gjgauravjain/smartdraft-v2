import React, { useState } from "react";
import { useTalentOrder } from "./useTalentOrder";
import { PlayerDatabaseType } from "@/app/api/type/player";
import { FILTERS } from "./util";
import { useIsMobile } from "@/hooks/use-mobile";
import FilterTalentOrder from "./FilterTalentOrder";
import FilterPlayerList from "./FilterPlayerList";

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
  const isMobile = useIsMobile();
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

  if (isMobile) {
    return (
      <div className="flex h-[calc(100vh-300px)] min-h-0 flex-col overflow-hidden">
        <FilterTalentOrder filter={filter} setFilter={setFilter} />
        <span className="text-[10.5px] px-2.5 py-1 text-muted-foreground">
          {remainingCount} of {totalCount} remaining
        </span>
        <FilterPlayerList playerList={playerList} className="pb-50" />
      </div>
    );
  }
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
        <FilterTalentOrder filter={filter} setFilter={setFilter} />
        <FilterPlayerList playerList={playerList} />
      </div>
    </div>
  );
};

export default TalentOrder;
