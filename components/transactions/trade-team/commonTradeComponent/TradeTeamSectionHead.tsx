"use client";

import { TradeAssetSectionTone } from "../type";
import { formatPoints } from "../util";

type TradeTeamSectionHeadProps = {
  label: string;
  count: number;
  subtotal: number | null;
  tone: TradeAssetSectionTone;
  roomy?: boolean;
};

export const TradeTeamSectionHead = ({
  label,
  count,
  subtotal,
  tone,
  roomy,
}: TradeTeamSectionHeadProps) => (
  <div
    className={
      roomy
        ? "grid grid-cols-[minmax(0,1fr)_56px_36px] items-baseline gap-2"
        : "grid grid-cols-[minmax(0,1fr)_56px_28px] items-baseline gap-2"
    }
  >
    <span
      className={
        tone === "in"
          ? "text-[10px] font-bold uppercase tracking-wide text-success-foreground"
          : "text-[10px] font-bold uppercase tracking-wide text-destructive"
      }
    >
      {label}
      {count ? ` · ${count}` : ""}
    </span>
    <span
      className={
        tone === "in"
          ? "text-right text-[11px] font-bold text-success-foreground tabular-nums"
          : "text-right text-[11px] font-bold text-destructive tabular-nums"
      }
    >
      {subtotal === null
        ? ""
        : tone === "in"
          ? `+${formatPoints(Math.abs(subtotal))}`
          : `−${formatPoints(Math.abs(subtotal))}`}
    </span>
    <span />
  </div>
);