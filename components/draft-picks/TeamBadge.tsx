"use client";

import { TeamType } from "@/app/api/type/common";
import { FlagTooltipType } from "@/app/api/type/flags";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FlagTooltipContent } from "./FlagTooltipContent";

export const TeamBadge = ({
  team,
  selected,
  onClick,
  onHovered,
  onHoverLeave,
  tooltipData,
}: {
  team: TeamType;
  selected: boolean;
  onClick: () => void;
  onHovered?: () => void;
  onHoverLeave?: () => void;
  tooltipData?: FlagTooltipType;
}) => {
  const badge = (
    <button
      onClick={onClick}
      title={team.shortName}
      className={cn(
        "relative h-7 w-7 shrink-0 cursor-pointer rounded-full border transition-all duration-150",
        "hover:scale-110 hover:brightness-110",
        selected && "scale-110 ring-2 ring-primary ring-offset-2",
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

  if (!tooltipData) {
    return badge;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{badge}</HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-auto border-border p-0 shadow-lg"
      >
        <FlagTooltipContent teamLogo={team.image} data={tooltipData} />
      </HoverCardContent>
    </HoverCard>
  );
};
