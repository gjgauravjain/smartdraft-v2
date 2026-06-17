import { TeamType } from "@/app/api/type/common";
import { DataOrderEntryType } from "@/app/api/type/draftpicks";
import { cn } from "@/lib/utils";
import {
  cellBackground,
  COL_WIDTH,
  getPicks,
  NAME_COL_WIDTH,
  pickValue,
} from "./util";

type OrderOfEntryProps = {
  data: DataOrderEntryType[];
  highlightTeamId?: string;
  teamsList: TeamType[];
};

const OrderOfEntry = ({
  data,
  highlightTeamId,
  teamsList,
}: OrderOfEntryProps) => {
  if (!data?.length) return null;

  const teams = [...data].sort((a, b) => {
    const aFirst = getPicks(a)[0] ?? a.maximumValue;
    const bFirst = getPicks(b)[0] ?? b.maximumValue;
    return aFirst - bFirst;
  });

  const maxCols = Math.max(...teams.map((t) => t.totalOrderLength));
  const columns = Array.from({ length: maxCols }, (_, i) => i + 1);
  const gridTemplate = `${NAME_COL_WIDTH}px repeat(${maxCols}, ${COL_WIDTH}px)`;

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-0 flex-col p-4">
      <div className="mb-2 flex shrink-0 items-center justify-end gap-1.75 text-[9.5px] font-semibold text-muted-foreground">
        <span>EARLY · high value</span>
        <span
          className="h-2 w-24 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, light-dark(rgb(134 207 155), rgb(87 177 115)), light-dark(rgb(187 222 150), rgb(148 195 110)), light-dark(rgb(235 220 142), rgb(207 185 95)), light-dark(rgb(239 188 131), rgb(211 143 87)), light-dark(rgb(232 145 128), rgb(200 106 91)))",
          }}
        />
        <span>LATE · low value</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-border bg-card">
        <div className="min-h-0 flex-1 overflow-auto">
          <div style={{ minWidth: NAME_COL_WIDTH + maxCols * COL_WIDTH }}>
            <div
              className="sticky top-0 z-20 grid border-b border-table-row-border bg-table-header"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <div className="sticky left-0 z-30 bg-table-header px-3.5 py-2 text-[9.5px] font-bold uppercase tracking-[0.6px] text-muted-foreground">
                Club · pick number
              </div>
              {columns.map((col) => (
                <div
                  key={col}
                  className="px-1.5 py-2 text-center text-[11px] font-bold tabular-nums text-muted-foreground"
                >
                  {col}
                </div>
              ))}
            </div>

            {teams.map((team) => {
              const picks = getPicks(team);
              const club = teamsList.find(
                (t) =>
                  t.teamNames.toLowerCase() === team.teamName.toLowerCase(),
              );
              const isHighlighted =
                club?.id.toString() === highlightTeamId?.toString();

              return (
                <div
                  key={team.id}
                  className={cn(
                    "group grid border-b border-table-row-border last:border-b-0",
                    isHighlighted && "bg-primary-light",
                  )}
                  style={{
                    gridTemplateColumns: gridTemplate,
                  }}
                >
                  <div
                    className={cn(
                      "sticky left-0 z-10 flex min-w-0 items-center gap-2 bg-card px-3.5 group-hover:bg-table-row-hover",
                      isHighlighted && "bg-primary-light",
                    )}
                  >
                    <img
                      src={club?.image}
                      className="h-4 w-4 rounded-2xl"
                      alt={club?.shortName}
                    />

                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isHighlighted
                          ? "dark:text-accent text-primary"
                          : "text-foreground",
                      )}
                    >
                      {club?.shortName ??
                        team.teamName.slice(0, 3).toUpperCase()}
                    </span>
                    <span className="truncate text-[10.5px] text-muted-foreground">
                      {team.teamName}
                    </span>
                  </div>

                  {columns.map((col, idx) => {
                    const pick = picks[idx];
                    if (pick === undefined) {
                      return <div key={col} className="px-1" />;
                    }
                    const t =
                      (pick - team.minimumValue) /
                      Math.max(1, team.maximumValue - team.minimumValue);
                    return (
                      <div key={col} className="flex items-center px-1 py-1">
                        <div
                          title={`Overall pick ${pick} · ${pickValue(pick)} pts`}
                          className="flex h-6 w-full items-center justify-center rounded-[5px] text-[11.5px] font-bold tabular-nums"
                          style={{
                            background: cellBackground(t),
                            color: "light-dark(rgb(36 48 66), rgb(21 25 31))",
                          }}
                        >
                          {pick}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOfEntry;
