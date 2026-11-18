"use client";

import { filterChipClass } from "../util";

type TradeTeamFilterChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export const TradeTeamFilterChip = ({
  label,
  selected,
  onClick,
}: TradeTeamFilterChipProps) => (
  <button type="button" onClick={onClick} className={filterChipClass(selected)}>
    {label}
  </button>
);