"use client";

import { TradeHandChip } from "../type";
import { handChipClass } from "../util";

type TradeTeamHandChipProps = {
  chip: TradeHandChip;
};

export const TradeTeamHandChip = ({ chip }: TradeTeamHandChipProps) => (
  <span
    className={`block h-6 truncate rounded-[5px] border px-1.5 text-center text-[11.5px] leading-5.5 font-semibold tabular-nums ${handChipClass(chip.tone)}`}
  >
    {chip.label}
  </span>
);