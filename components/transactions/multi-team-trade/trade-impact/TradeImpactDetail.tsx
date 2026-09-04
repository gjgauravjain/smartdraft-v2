import { TeamType } from "@/app/api/type/common";
import { TradeImpactResponse } from "@/app/api/type/trade";
import { passedCheckCount } from "../util";
import { cn } from "@/lib/utils";
import { DetailCard } from "../DetailCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { RuleCheckRow } from "../RuleCheckRow";

export const TradeImpactDetail = ({
  impact,
  teamsById,
  showTeamCards = true,
}: {
  impact: TradeImpactResponse;
  teamsById: Map<string, TeamType>;
  showTeamCards?: boolean;
}) => {
  const passed = passedCheckCount(impact.validityChecks);
  const failed = [
    impact.validityChecks.tradeBackRule,
    impact.validityChecks.pickExists,
    impact.validityChecks.picksMatch,
  ].filter((check) => check.status === "Fail").length;

  return (
    <div className={showTeamCards ? "mt-3.5" : "mt-2.5"}>
      {showTeamCards ? (
        <div className="mb-2 flex items-center gap-2">
          <div className="whitespace-nowrap text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-muted-foreground">
            Detail
          </div>
          <span className="text-[9.5px] text-muted-foreground">
            hands + rule checks
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {showTeamCards ? (
          <div
            className={cn(
              "flex min-w-0 items-stretch gap-2.5",
              impact.teams.length > 3 && "overflow-x-auto pb-1",
            )}
          >
            {impact.teams.map((team) => (
              <div
                key={team.teamId}
                className={cn(
                  "flex min-h-0 flex-col",
                  impact.teams.length > 3
                    ? "w-[calc((100%-1.25rem)/3)] shrink-0 grow-0"
                    : "min-w-0 flex-1",
                )}
              >
                <DetailCard
                  team={team}
                  club={teamsById.get(String(team.teamId))}
                />
              </div>
            ))}
          </div>
        ) : null}

        <Collapsible className="overflow-hidden rounded-[10px] border border-border bg-card">
          <CollapsibleTrigger className="group flex w-full items-center gap-[9px] px-[13px] py-2.5 text-left">
            <ChevronRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
            <span className="text-[12.5px] font-bold text-foreground">
              Rule checks
            </span>
            <span
              className={cn(
                "text-[10.5px]",
                failed
                  ? "font-bold text-destructive"
                  : "font-normal text-muted-foreground",
              )}
            >
              {failed ? `${failed} failed` : `${passed} passed`}
            </span>
            <span className="flex-1" />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col border-t border-border">
            <RuleCheckRow
              label="Trade-back rule"
              check={impact.validityChecks.tradeBackRule}
            />
            <RuleCheckRow
              label="Pick exists"
              check={impact.validityChecks.pickExists}
            />
            <RuleCheckRow
              label="Picks match"
              check={impact.validityChecks.picksMatch}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
