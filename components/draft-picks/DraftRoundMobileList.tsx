import { DraftYearList } from "@/app/api/type/draftpicks";
import { Chip } from "@/components/ui/Chip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatPlayerName, isPlayerName } from "./util";

type Props = {
  title: string;
  picks: DraftYearList[];
  userTeamId?: number | string;
};

export function DraftRoundMobileList({ title, picks, userTeamId }: Props) {
  return (
    <div className="rounded-[10px] mt-4 border border-border overflow-hidden bg-card">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
        <span className="text-[13px] font-bold text-foreground">{title}</span>
        <span className="text-[11px] text-muted-foreground">
          {picks.length} picks
        </span>
      </div>

      {picks.map((pick) => {
        const isUser =
          userTeamId !== undefined &&
          Number(pick.teamId) === Number(userTeamId);
        const hasNote =
          pick.currentOwnerShort !== pick.displayNameShort || !!pick.reason;
        const hasPlayer = isPlayerName(pick.pointPlayer);

        return (
          <div
            key={`${pick.draftRound}-${pick.overallPick}-${pick.id}`}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 border-b border-border/60 last:border-b-0",
              isUser && "bg-primary/18",
            )}
          >
            <div
              className={cn(
                "w-6 text-[13px] font-bold tabular-nums shrink-0",
                isUser ? "text-primary" : "text-foreground",
              )}
            >
              {pick.overallPick}
            </div>

            {pick.image ? (
              <img
                src={pick.image}
                alt={pick.currentOwnerShort}
                className="w-5 h-5 rounded-full border border-border/30 shrink-0 object-cover"
              />
            ) : (
              <span className="w-5 h-5 rounded-full border border-white/20 bg-muted shrink-0" />
            )}

            <span
              className={cn(
                "text-[12px] font-semibold shrink-0",
                isUser ? "text-primary" : "text-foreground",
              )}
            >
              {pick.currentOwnerShort}
            </span>

            {hasNote && (
              <Tooltip>
                <TooltipTrigger>
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-muted-foreground/50 text-muted-foreground text-[10px] font-bold italic font-serif cursor-help shrink-0">
                    i
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {pick.reason}
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex-1" />

            {hasPlayer ? (
              <Chip title={pick.pointPlayer} variant="success">
                {formatPlayerName(pick.pointPlayer)}
              </Chip>
            ) : (
              <span
                className={cn(
                  "text-[11px] text-muted-foreground tabular-nums shrink-0",
                  isUser && "text-primary",
                )}
              >
                {pick.pointPlayer || pick.aflPointValue}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
