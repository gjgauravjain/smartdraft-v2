import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";

interface MobileTeamBadgeProps {
  teams: TeamType[];
  selectedTeamId?: string;
  isAll: boolean;
  onToggleAll: (value: boolean) => void;
  onTeamSelect?: (id: string) => void;
}

export function MobileTeamBadge({
  teams,
  selectedTeamId,
  isAll,
  onToggleAll,
  onTeamSelect,
}: MobileTeamBadgeProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto px-3 py-2.5">
        <button
          onClick={() => onToggleAll(!isAll)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1",
            isAll
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground",
          )}
        >
          <span
            className={cn(
              "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[8.5px] font-extrabold tracking-[0.3px]",
              isAll
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            ALL
          </span>

          <span className="text-[11px] font-bold">All</span>
        </button>

        <div className="mx-1 h-[22px] w-px shrink-0 bg-border" />

        {teams.map((team) => {
          const selected = !isAll && team.id === selectedTeamId;

          return (
            <button
              key={team.id}
              title={team.shortName}
              onClick={() => onTeamSelect?.(team.id)}
              className={cn(
                "rounded-full p-[2px] shrink-0 transition-all",
                selected ? "bg-primary" : "hover:bg-muted",
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
                {team.image ? (
                  <img
                    src={team.image}
                    alt={team.teamNames}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] font-bold">{team.shortName}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
