import { cn } from "@/lib/utils";
import { BidChip } from "./type";
import { BidMatchResult } from "./type";
import { boxClass, chipClass } from "./util";

type BidMatchStatusProps = {
  result: BidMatchResult;
};

const StatusChips = ({ chips }: { chips: BidChip[] }) => {
  if (!chips.length) return null;
  return (
    <span className="flex flex-wrap justify-end gap-1">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
            chipClass(chip.tone),
          )}
        >
          {chip.label}
        </span>
      ))}
    </span>
  );
};

export const BidMatchStatus = ({ result }: BidMatchStatusProps) => {
  const { box } = result;
  return (
    <div className={cn("rounded-xl border px-3 py-2.5", boxClass(box.tone))}>
      <div className="text-sm font-semibold">{box.title}</div>
      {box.detail ? (
        <p className="mt-1 text-xs leading-relaxed">{box.detail}</p>
      ) : null}
      {box.rows.length ? (
        <div className="mt-2 grid gap-1.5">
          {box.rows.map((row) => (
            <div
              key={row.key}
              className="flex items-start justify-between gap-3 text-xs"
            >
              <span className="pt-0.5 font-medium">{row.label}</span>
              <span className="min-w-0 text-right">
                <StatusChips chips={row.chips} />
                {row.note ? <span className="mt-0.5 block">{row.note}</span> : null}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {box.note ? (
        <p className="mt-2 text-xs leading-relaxed">{box.note}</p>
      ) : null}
    </div>
  );
};
