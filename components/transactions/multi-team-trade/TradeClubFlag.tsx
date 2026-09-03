import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";

export const TradeClubFlag = ({
  team,
  size = "md",
  className,
}: {
  team?: TeamType | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const dim =
    size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-[22px] w-[22px]" : "h-[17px] w-[17px]";

  if (!team?.image) {
    return (
      <span
        className={cn(
          "shrink-0 rounded-full border border-dashed border-border bg-muted",
          dim,
          className,
        )}
      />
    );
  }

  return (
    <img
      src={team.image}
      alt={team.teamNames}
      className={cn(
        "shrink-0 rounded-full border border-black/15 object-cover",
        dim,
        className,
      )}
    />
  );
};
