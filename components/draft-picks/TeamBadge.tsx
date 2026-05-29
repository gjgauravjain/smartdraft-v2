import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";

export const TeamBadge = ({
  team,
  selected,
  onClick,
  onHovered,
  onHoverLeave,
}: {
  team: TeamType;
  selected: boolean;
  onClick: () => void;
  onHovered?: () => void;
  onHoverLeave?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      title={team.id}
      className={cn(
        "relative h-7 w-7  shrink-0 border cursor-pointer rounded-full transition-all duration-150",
        "hover:scale-110 hover:brightness-110",
        selected && "ring-2 ring-offset-2  ring-primary scale-110",
      )}
      onMouseEnter={onHovered}
      onMouseLeave={onHoverLeave}
    >
      <img
        src={team.image}
        alt={team.teamNames}
        className="h-full w-full rounded-full"
      />
    </button>
  );
};
