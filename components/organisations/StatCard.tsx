import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
}: StatCardProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "bg-card border border-border rounded-[10px] p-3 font-sans",
          onClick && "cursor-pointer active:opacity-70 transition-opacity",
        )}
      >
        <div className="text-[24px] font-extrabold text-foreground tracking-[-0.5px] tabular-nums">
          {value}
        </div>
        <div
          className={cn(
            "text-[10.5px] mt-px leading-[1.25]",
            subLabelHighlight
              ? "text-sub-heading font-semibold"
              : "text-muted-foreground font-normal",
          )}
        >
          {subLabelHighlight ? `${label} ›` : label}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-xl p-4 font-sans",
        onClick ? "cursor-pointer" : "cursor-default",
      )}
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
        className={cn(
          "text-[11.5px] mt-0.5",
          subLabelHighlight
            ? "text-sub-heading font-semibold"
            : "text-muted-foreground font-normal",
        )}
      >
        {subLabel}
      </div>
    </div>
  );
};
