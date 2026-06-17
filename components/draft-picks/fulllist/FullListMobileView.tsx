"use client";

import { useState, useMemo } from "react";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileFullListFilter, { SortKey } from "./MobileFilter";
import MobileRoundGroupCard from "./MobileRoundGroupCard";

type Props = {
  data: DataFullOrderListType[];
  teams: TeamType[];
  highlightTeamId?: string;
};

const FullListMobileView = ({ data, teams, highlightTeamId }: Props) => {
  const [clubFilter, setClubFilter] = useState("ALL");
  const [reasonFilter, setReasonFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("pick");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const highlightShortName = useMemo(
    () => teams.find((t) => t.id === highlightTeamId)?.shortName,
    [teams, highlightTeamId],
  );

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const clubMatch = clubFilter === "ALL" || item.shortName === clubFilter;
      let reasonMatch = true;
      if (reasonFilter !== "ALL") {
        reasonMatch = item.reason === reasonFilter;
      }
      return clubMatch && reasonMatch;
    });
  }, [data, clubFilter, reasonFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "pick") {
        cmp = (parseInt(a.overallPick) || 0) - (parseInt(b.overallPick) || 0);
      } else if (sortKey === "pts") {
        cmp =
          (parseFloat(a.aflPointValue) || 0) -
          (parseFloat(b.aflPointValue) || 0);
      } else if (sortKey === "club") {
        cmp = (a.shortName ?? "").localeCompare(b.shortName ?? "");
      } else if (sortKey === "reason") {
        cmp = (a.reason ?? "").localeCompare(b.reason ?? "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const groups = useMemo(() => {
    const map = new Map<string, DataFullOrderListType[]>();
    for (const item of sorted) {
      const r = item.draftRound ?? "?";
      if (!map.has(r)) map.set(r, []);
      map.get(r)!.push(item);
    }
    return Array.from(map.entries()).map(([round, rows]) => ({
      round,
      rows,
      totalPts: rows.reduce(
        (acc, i) => acc + (parseFloat(i.aflPointValue) || 0),
        0,
      ),
    }));
  }, [sorted]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full overflow-hidden">
        <MobileFullListFilter
          teams={teams}
          clubFilter={clubFilter}
          reasonFilter={reasonFilter}
          sortKey={sortKey}
          data={data}
          sortDir={sortDir}
          onClubChange={setClubFilter}
          onReasonChange={setReasonFilter}
          onSortKeyChange={setSortKey}
          onSortDirToggle={() =>
            setSortDir((d) => (d === "asc" ? "desc" : "asc"))
          }
        />

        <div className="h-[calc(100vh-200px)] block overflow-y-auto px-3 pb-100">
          {groups.map(({ round, rows, totalPts }, i) => (
            <MobileRoundGroupCard
              key={round}
              label={round === "?" ? "Unknown Round" : `Round ${round}`}
              pickCount={rows.length}
              totalPts={totalPts}
              items={rows}
              teams={teams}
              highlightShortName={highlightShortName}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FullListMobileView;
