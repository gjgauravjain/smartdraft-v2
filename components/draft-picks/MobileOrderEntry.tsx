import { TeamType } from "@/app/api/type/common";
import { DataOrderEntryType } from "@/app/api/type/draftpicks";
import { cn } from "@/lib/utils";
import { cellBackground, getPicks, pickValue } from "./util";

type MobileOrderEntryProps = {
  data: DataOrderEntryType[];
  highlightTeamId?: string;
  teamsList: TeamType[];
};

export default function MobileOrderEntry({
  data,
  highlightTeamId,
  teamsList,
}: MobileOrderEntryProps) {
  if (!data?.length) return null;

  const teams = [...data].sort((a, b) => {
    const aFirst = getPicks(a)[0] ?? a.maximumValue;
    const bFirst = getPicks(b)[0] ?? b.maximumValue;

    return aFirst - bFirst;
  });

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <span className="text-[10px] font-semibold text-muted-foreground">
          EARLY
        </span>

        <div
          className="h-2 flex-1 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, light-dark(rgb(134 207 155), rgb(87 177 115)), light-dark(rgb(187 222 150), rgb(148 195 110)), light-dark(rgb(235 220 142), rgb(207 185 95)), light-dark(rgb(239 188 131), rgb(211 143 87)), light-dark(rgb(232 145 128), rgb(200 106 91)))",
          }}
        />

        <span className="text-[10px] font-semibold text-muted-foreground">
          LATE
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3 h-[90vh] overflow-y-scroll pb-100">
        {teams.map((team) => {
          const picks = getPicks(team);

          const club = teamsList.find(
            (t) => t.teamNames.toLowerCase() === team.teamName.toLowerCase(),
          );

          const isHighlighted =
            club?.id?.toString() === highlightTeamId?.toString();

          return (
            <div
              key={team.id}
              className={cn(
                "rounded-xl border bg-card p-3",
                isHighlighted &&
                  "border-primary/30 shadow-[inset_3px_0_0_0] shadow-primary",
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <img
                  src={club?.image}
                  alt={club?.shortName}
                  className="h-5 w-5 rounded-full"
                />

                <span
                  className={cn(
                    "text-[13.5px] font-bold",
                    isHighlighted
                      ? "text-primary dark:text-accent"
                      : "text-foreground",
                  )}
                >
                  {club?.shortName}
                </span>

                <span className="min-w-0 flex-1 truncate text-[11.5px] text-muted-foreground">
                  {team.teamName}
                </span>

                <span className="text-[10px] font-semibold text-muted-foreground">
                  {picks.length} picks
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {picks.map((pick, index) => {
                  const t =
                    (pick - team.minimumValue) /
                    Math.max(1, team.maximumValue - team.minimumValue);

                  return (
                    <div
                      key={`${team.id}-${pick}`}
                      title={`${pickValue(pick)} pts`}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1"
                      style={{
                        background: cellBackground(t),
                        color: "light-dark(rgb(36 48 66), rgb(21 25 31))",
                      }}
                    >
                      <span className="text-[9px] font-bold opacity-70">
                        {index + 1}
                      </span>

                      <span className="text-[13px] font-extrabold tabular-nums">
                        {pick}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
