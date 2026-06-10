import React from "react";

type StatCardProps = {
  label: string;
  value: number;
  subLabel: string;
  subLabelHighlight?: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
};

export const StatCard = ({
  label,
  value,
  subLabel,
  subLabelHighlight,
  icon,
  onClick,
}: StatCardProps) => (
  <div
    onClick={onClick}
    className={[
      "bg-card border border-border rounded-xl p-4 font-sans",
      onClick ? "cursor-pointer" : "cursor-default",
    ].join(" ")}
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.6px]">
        {label}
      </span>
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <div className="text-[30px] font-extrabold text-foreground tracking-[-1px] mt-1.5 tabular-nums">
      {value}
    </div>
    <div
      className={[
        "text-[11.5px] mt-0.5",
        subLabelHighlight
          ? "text-sub-heading font-semibold"
          : "text-muted-foreground font-normal",
      ].join(" ")}
    >
      {subLabel}
    </div>
  </div>
);
