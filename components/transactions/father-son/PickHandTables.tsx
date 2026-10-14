import { cn } from "@/lib/utils";
import {
  FatherSonBidImpactResponse,
  DraftHandPick,
} from "@/app/api/type/transaction";
import { formatNumber } from "./util";
import { useIsMobile } from "@/hooks/use-mobile";

interface PickInRound {
  pickNo: number;
  status: string;
  matchRole?: string;
  originalOwner?: string;
  isFatherSon?: boolean;
  isUsed?: boolean;
}

const PickHandTable = ({
  title,
  handPicks,
  impact,
  isBefore,
  yearPoints,
}: {
  title: string;
  handPicks: DraftHandPick[];
  impact: FatherSonBidImpactResponse;
  isBefore: boolean;
  yearPoints?: Record<string, number>;
}) => {
  const isMobile = useIsMobile();

  const deficitVisual = impact.overallImpactVisual?.find(
    (v) => v.summary === "Points Deficit" && v.deficitImpact,
  );
  const deficitImpact = deficitVisual?.deficitImpact;
  const deficitHitPick =
    deficitImpact && !isBefore
      ? {
          year: deficitImpact.year[0],
          round: deficitImpact.draftRoundInt[0],
          oldPick: deficitImpact.overallPick[0],
          newPick: deficitImpact.newOverallPick[0],
        }
      : null;

  const yearMap = new Map<string, DraftHandPick[]>();
  handPicks.forEach((pick) => {
    const year = String(pick.year);
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(pick);
  });

  const years = Array.from(yearMap.keys())
    .sort((a, b) => Number(a) - Number(b))
    .slice(0, 3);

  const tableData = years.map((year) => {
    const picks = yearMap.get(year) || [];
    const isFuture = picks[0]?.yearType === "Next";

    const roundMap = new Map<number, PickInRound[]>();
    for (let r = 1; r <= 6; r++) {
      roundMap.set(r, []);
    }

    picks.forEach((pick) => {
      const round = Number(pick.draftRoundInt);
      if (round >= 1 && round <= 6) {
        const pickNo = Number(pick.overallPick);
        const isFatherSon = pick.pickStatus?.toLowerCase().includes("father");
        const isUsed = pick.pickStatus?.toLowerCase().includes("used");

        roundMap.get(round)!.push({
          pickNo,
          status: pick.pickStatus || "",
          isFatherSon,
          isUsed,
        });
      }
    });

    roundMap.forEach((picks) => {
      picks.sort((a, b) => a.pickNo - b.pickNo);
    });

    let points: number;
    if (yearPoints && yearPoints[year]) {
      points = yearPoints[year];
    } else {
      points = picks
        .filter((p) => !p.pickStatus?.toLowerCase().includes("father"))
        .reduce((sum, p) => sum + (p.pickPoints || 0), 0);
    }

    return {
      year,
      isFuture,
      rounds: Array.from({ length: 6 }, (_, i) => roundMap.get(i + 1) || []),
      points,
    };
  });

  const renderPickCell = (
    picks: PickInRound[],
    year: string,
    roundNo: number,
  ) => {
    if (picks.length === 0) {
      return <span className="text-border">—</span>;
    }

    return picks.map((pick, idx) => {
      const isDeficitHit =
        deficitHitPick &&
        String(year) === String(deficitHitPick.year) &&
        roundNo === deficitHitPick.round;

      const pickText = tableData.find((d) => d.year === year)?.isFuture
        ? `~${isDeficitHit && !isBefore ? deficitHitPick.newPick : pick.pickNo}`
        : String(pick.pickNo);

      const classes = cn(
        pick.isUsed &&
          isBefore &&
          "rounded bg-destructive/10 px-1 text-destructive",
        pick.isFatherSon && !isBefore && "font-extrabold text-fs-pick",
        isDeficitHit && !isBefore && "font-extrabold text-deficit-text",
      );

      return (
        <span key={idx}>
          {idx > 0 && ", "}
          <span className={classes}>{pickText}</span>
        </span>
      );
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-2 text-[13px] font-extrabold text-foreground">
        {title}
      </div>

      <div className={cn("overflow-x-auto", isMobile && "-mx-1")}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="px-2 py-2 text-left text-[10px] font-extrabold uppercase tracking-wide text-text4">
                {/* Year column */}
              </th>
              {Array.from({ length: 6 }, (_, i) => (
                <th
                  key={i}
                  className="border-l border-border px-2 py-2 text-center text-[10px] font-extrabold uppercase tracking-wide text-text4"
                >
                  R{i + 1}
                </th>
              ))}
              <th className="border-l border-border px-2 py-2 text-right text-[10px] font-extrabold uppercase tracking-wide text-text4">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIdx) => (
              <tr
                key={row.year}
                className={cn(
                  "border-t border-border",
                  row.isFuture && "bg-secondary/20 text-muted-foreground",
                )}
              >
                <td
                  className={cn(
                    "px-2 py-3 text-[11.5px] font-extrabold tabular-nums",
                    row.isFuture ? "text-text4" : "text-foreground",
                  )}
                >
                  {row.year}
                </td>
                {row.rounds.map((picks, roundIdx) => (
                  <td
                    key={roundIdx}
                    className="border-l border-border px-2 py-3 text-[11.5px] font-semibold tabular-nums"
                  >
                    {renderPickCell(picks, row.year, roundIdx + 1)}
                  </td>
                ))}
                <td className="border-l border-border px-2 py-3 text-right text-[11.5px] font-bold tabular-nums">
                  {row.isFuture && "~"}
                  {formatNumber(row.points)}{" "}
                  <span className="text-[10.5px] font-semibold text-text4">
                    pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isBefore && (
        <div className="mt-3 text-[11px] leading-relaxed text-text4">
          <span className="rounded bg-destructive/10 px-1 text-deficit-text">
            Shaded
          </span>{" "}
          used to match the bid ·{" "}
          <span className="font-extrabold text-fs-pick">Red</span> father-son
          pick · <span className="font-extrabold text-deficit-text">Amber</span>{" "}
          moved by the deficit · ~ projected · Points = usable draft points, not
          counting the father-son pick
        </div>
      )}
    </div>
  );
};

export const PickHandTables = ({
  impact,
  clubName,
}: {
  impact: FatherSonBidImpactResponse;
  clubName: string;
}) => {
  return (
    <div>
      <PickHandTable
        title={`${clubName} picks before this match`}
        handPicks={impact.initialDraftHand}
        impact={impact}
        isBefore={true}
        yearPoints={impact.handPoints?.before}
      />
      <PickHandTable
        title={`${clubName} picks after this match`}
        handPicks={impact.newDraftHand}
        impact={impact}
        isBefore={false}
        yearPoints={impact.handPoints?.after}
      />
    </div>
  );
};
