"use client";

import { useMemo, useState } from "react";
import { DataFullOrderListType } from "@/app/api/type/draftpicks";
import FullListTable from "./FullListTable";
import FullListFilters from "./FullListFilters";
import { TeamType } from "@/app/api/type/common";

type Props = {
  data: DataFullOrderListType[];
  teams: TeamType[];
  highlightTeamId?: string;
};

const FullListView = ({ data, teams, highlightTeamId }: Props) => {
  const [clubFilter, setClubFilter] = useState("ALL");
  const [reasonFilter, setReasonFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const clubMatch = clubFilter === "ALL" || item.shortName === clubFilter;

      let reasonMatch = true;
      if (reasonFilter !== "ALL") {
        reasonMatch = item.reason === reasonFilter;
      }

      return clubMatch && reasonMatch;
    });
  }, [data, clubFilter, reasonFilter]);

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 pb-12">
      <FullListFilters
        data={filteredData}
        clubFilter={clubFilter}
        reasonFilter={reasonFilter}
        onClubChange={setClubFilter}
        onReasonChange={setReasonFilter}
        teams={teams}
      />
      <FullListTable
        highlightTeamId={highlightTeamId}
        data={filteredData}
        teams={teams}
      />
    </div>
  );
};

export default FullListView;
