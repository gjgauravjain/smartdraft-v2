"use client";

import { TradeAssetRow } from "../type";
import { formatPoints } from "../util";

type TradeTeamAssetRowProps = {
  row: TradeAssetRow;
  muted?: boolean;
  roomy?: boolean;
  onRemove?: () => void;
};

export const TradeTeamAssetRow = ({
  row,
  muted,
  roomy,
  onRemove,
}: TradeTeamAssetRowProps) => (
  <div
    className={
      roomy
        ? "grid min-h-9 grid-cols-[minmax(0,1fr)_56px_36px] items-center gap-2"
        : "grid min-h-7 grid-cols-[minmax(0,1fr)_56px_28px] items-center gap-2"
    }
  >
    <span
      className={
        muted
          ? "block max-w-33 truncate rounded-md border border-border bg-card px-1.5 text-left text-[11.5px] font-semibold leading-6 text-muted-foreground"
          : "block max-w-33 truncate rounded-md border border-border bg-muted px-1.5 text-left text-[11.5px] font-semibold leading-6 text-foreground"
      }
    >
      {row.label}
    </span>
    <span className="text-right text-xs text-muted-foreground tabular-nums">
      {row.points === null ? "–" : formatPoints(row.points)}
    </span>
    {onRemove ? (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${row.label}`}
        className={
          roomy
            ? "size-9 text-[17px] leading-none text-muted-foreground hover:rounded-md hover:bg-muted"
            : "size-7 text-[17px] leading-none text-muted-foreground hover:rounded-md hover:bg-muted"
        }
      >
        ×
      </button>
    ) : (
      <span />
    )}
  </div>
);