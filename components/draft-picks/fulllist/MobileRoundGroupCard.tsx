"use client";

import { useState } from "react";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";
import MobileRow from "./MobileRow";

type Props = {
  label: string;
  pickCount: number;
  totalPts: number;
  items: DataFullOrderListType[];
  teams: TeamType[];
  highlightShortName?: string;
  defaultOpen?: boolean;
};

const MobileRoundGroupCard = ({
  label,
  pickCount,
  totalPts,
  items,
  teams,
  highlightShortName,
  defaultOpen = true,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-card mt-4 rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3.5 py-2.75 cursor-pointer"
      >
        <span className="text-[13px] font-bold text-foreground">{label}</span>
        <span className="text-[11px] text-muted-foreground">
          {pickCount} picks
        </span>
        <div className="flex-1" />
        {totalPts > 0 && (
          <span className="text-[10.5px] text-muted-foreground tabular-nums">
            {totalPts.toLocaleString()} pts
          </span>
        )}
        <span
          className={cn(
            "text-[11px] text-muted-foreground ml-1 transition-transform duration-150",
            open ? "rotate-90" : "rotate-0",
          )}
        >
          ›
        </span>
      </button>

      {/* Rows */}
      {open &&
        items.map((item) => (
          <MobileRow
            key={item.id}
            item={item}
            teams={teams}
            isAccented={
              !!highlightShortName && item.shortName === highlightShortName
            }
          />
        ))}
    </div>
  );
};

export default MobileRoundGroupCard;
