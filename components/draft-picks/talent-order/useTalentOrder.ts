import { PlayerDatabaseType, TalentFilter } from "@/app/api/type/player";
import { useMemo, useState } from "react";
import { shapePlayer } from "./util";

export function useTalentOrder(players: PlayerDatabaseType[]) {
  const [filter, setFilter] = useState<TalentFilter>("all");

  const allRows = useMemo(
    () => players.map((p, i) => shapePlayer(p, i + 1)),
    [players],
  );

  const playerList = useMemo(() => {
    if (filter === "available") {
      return allRows.filter((r) => r.status === "available");
    }
    if (filter === "drafted") {
      return allRows.filter((r) => r.status === "drafted");
    }
    return allRows;
  }, [allRows, filter]);

  const remainingCount = useMemo(
    () => allRows.filter((r) => r.status === "available").length,
    [allRows],
  );

  return {
    playerList,
    filter,
    setFilter,
    totalCount: allRows.length,
    remainingCount,
  };
}
