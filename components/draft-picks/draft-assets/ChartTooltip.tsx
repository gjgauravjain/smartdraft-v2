import { formatPoints } from "./util";

export function ChartTooltip({ active, payload, label, years }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce(
    (sum: number, p: any) => sum + (typeof p.value === "number" ? p.value : 0),
    0,
  );
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
      <p className="mb-1.5 text-xs font-bold text-popover-foreground">
        {label}
      </p>
      <div className="space-y-0.5">
        {years.map((year: string) => {
          const entry = payload.find((p: any) => p.dataKey === year);
          if (!entry || entry.value === undefined) return null;
          return (
            <div
              key={year}
              className="flex items-center justify-between gap-3 text-[11px]"
            >
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: entry.fill }}
                />
                {year}
              </span>
              <span className="font-semibold tabular-nums text-popover-foreground">
                {formatPoints(entry.value as number)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-border pt-1.5 text-[11px]">
        <span className="font-medium text-muted-foreground">Total</span>
        <span className="font-bold tabular-nums text-primary">
          {formatPoints(total)}
        </span>
      </div>
    </div>
  );
}
