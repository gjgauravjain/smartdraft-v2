"use client";

import { useMemo } from "react";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import { TeamType } from "@/app/api/type/common";
import SdTable, { SdTableGroup } from "@/components/common/SdTable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAdjusted } from "./util";
import { FullListColumns } from "./Column";

type Props = {
  data: DataFullOrderListType[];
  teams: TeamType[];
  highlightTeamId?: string;
};

const FullListTable = ({ data, teams, highlightTeamId }: Props) => {
  const highlightShortName = useMemo(
    () => teams.find((t) => t.id === highlightTeamId)?.shortName,
    [teams, highlightTeamId],
  );
  const columns = useMemo(
    () => FullListColumns(teams, highlightShortName),
    [teams, highlightShortName],
  );

  const groups = useMemo<SdTableGroup<DataFullOrderListType>[]>(() => {
    const map = new Map<string, DataFullOrderListType[]>();
    for (const item of data) {
      const r = item.draftRound ?? "?";
      if (!map.has(r)) map.set(r, []);
      map.get(r)!.push(item);
    }
    return Array.from(map.entries()).map(([round, rows]) => {
      const totalPts = rows.reduce(
        (acc, i) => acc + (parseFloat(i.aflPointValue) || 0),
        0,
      );
      return {
        label: `Round ${round}`,
        summary: totalPts > 0 ? `${totalPts.toLocaleString()} pts` : undefined,
        rows,
      };
    });
  }, [data]);

  return (
    <TooltipProvider delayDuration={200}>
      <SdTable
        groups={groups}
        columns={columns}
        rowKey={(r) => r.id}
        highlightRow={isAdjusted}
        accentRow={(r) =>
          !!highlightShortName && r.shortName === highlightShortName
        }
        defaultSortKey="overallPick"
        defaultSortDir="asc"
        className="block overflow-auto"
        tableBodyClassName="h-[60vh]"
      />
    </TooltipProvider>
  );
};

export default FullListTable;
