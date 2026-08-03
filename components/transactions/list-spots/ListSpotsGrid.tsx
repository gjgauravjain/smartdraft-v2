"use client";

import { ListSpotsGridData } from "@/app/api/type/roster-spots";
import {
  clampListSpots,
  LIST_SPOTS_MAX,
  LIST_SPOTS_MIN,
} from "@/app/api/util/roster-spots";
import { TeamType } from "@/app/api/type/common";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

type ListSpotsGridProps = {
  grid: ListSpotsGridData;
  teamsById: Map<string, TeamType>;
  isLoading?: boolean;
  onChange: (teamId: number, year: number, value: number) => void;
  className?: string;
};

const StepperButton = ({
  disabled,
  onClick,
  children,
  label,
  size = "default",
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  size?: "default" | "mobile";
}) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "flex shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors",
      "hover:bg-secondary hover:text-foreground",
      "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground",
      size === "mobile" ? "h-8 w-8" : "h-7 w-7",
    )}
  >
    {children}
  </button>
);

const ListSpotsStepper = ({
  value,
  onDecrement,
  onIncrement,
  size = "default",
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: "default" | "mobile";
}) => (
  <div className="flex items-center gap-1.5">
    <StepperButton
      label="Decrease list spots"
      disabled={value <= LIST_SPOTS_MIN}
      onClick={onDecrement}
      size={size}
    >
      <Minus className={size === "mobile" ? "h-4 w-4" : "h-3.5 w-3.5"} />
    </StepperButton>
    <span
      className={cn(
        "min-w-[1.25rem] text-center font-semibold tabular-nums text-foreground",
        size === "mobile" ? "text-base" : "text-sm",
      )}
    >
      {value}
    </span>
    <StepperButton
      label="Increase list spots"
      disabled={value >= LIST_SPOTS_MAX}
      onClick={onIncrement}
      size={size}
    >
      <Plus className={size === "mobile" ? "h-4 w-4" : "h-3.5 w-3.5"} />
    </StepperButton>
  </div>
);

const ListSpotsGridTable = ({
  grid,
  teamsById,
  onChange,
  className,
}: Omit<ListSpotsGridProps, "isLoading">) => {
  const gridTemplateColumns = `36px minmax(140px, 1.4fr) ${grid.years
    .map(() => "minmax(108px, 1fr)")
    .join(" ")}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      <div
        className="grid items-center gap-x-2 border-b border-border bg-muted/50 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
        style={{ gridTemplateColumns }}
      >
        <span>#</span>
        <span>Team</span>
        {grid.years.map((year) => (
          <span key={year} className="text-center">
            {year}
          </span>
        ))}
      </div>

      <div className="max-h-[45vh] divide-y divide-border overflow-y-auto">
        {grid.rows.map((row, index) => {
          const team = teamsById.get(String(row.teamId));

          return (
            <div
              key={row.teamId}
              className="grid items-center gap-x-2 px-3 py-2.5"
              style={{ gridTemplateColumns }}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>

              <div className="flex min-w-0 items-center gap-2">
                {team?.image ? (
                  <img
                    src={team.image}
                    alt={team.shortName}
                    className="h-7 w-7 shrink-0 rounded-full"
                  />
                ) : (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-muted" />
                )}
                <span className="truncate text-sm font-semibold text-foreground">
                  {team?.shortName ?? `Team ${row.teamId}`}
                </span>
              </div>

              {grid.years.map((year) => {
                const value = row.spotsByYear[year] ?? LIST_SPOTS_MIN;

                return (
                  <div key={`${row.teamId}-${year}`}>
                    <ListSpotsStepper
                      value={value}
                      onDecrement={() =>
                        onChange(row.teamId, year, clampListSpots(value - 1))
                      }
                      onIncrement={() =>
                        onChange(row.teamId, year, clampListSpots(value + 1))
                      }
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ListSpotsGridCards = ({
  grid,
  teamsById,
  onChange,
  className,
}: Omit<ListSpotsGridProps, "isLoading">) => {
  return (
    <div className={cn("space-y-2.5", className)}>
      {grid.rows.map((row, index) => {
        const team = teamsById.get(String(row.teamId));

        return (
          <div
            key={row.teamId}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-3 py-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                {index + 1}
              </span>
              {team?.image ? (
                <img
                  src={team.image}
                  alt={team.shortName}
                  className="h-8 w-8 shrink-0 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
                {team?.shortName ?? `Team ${row.teamId}`}
              </span>
            </div>

            <div className="divide-y divide-border/70">
              {grid.years.map((year) => {
                const value = row.spotsByYear[year] ?? LIST_SPOTS_MIN;

                return (
                  <div
                    key={`${row.teamId}-${year}`}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        List spots
                      </p>
                      <p className="text-sm font-bold text-foreground">{year}</p>
                    </div>
                    <ListSpotsStepper
                      size="mobile"
                      value={value}
                      onDecrement={() =>
                        onChange(row.teamId, year, clampListSpots(value - 1))
                      }
                      onIncrement={() =>
                        onChange(row.teamId, year, clampListSpots(value + 1))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ListSpotsGrid = ({
  grid,
  teamsById,
  isLoading = false,
  onChange,
  className,
}: ListSpotsGridProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className={cn("space-y-2.5", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "w-full rounded-xl",
              isMobile ? "h-[108px]" : "h-11 rounded-lg",
            )}
          />
        ))}
      </div>
    );
  }

  if (!grid.rows.length) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        No list spots data available.
      </div>
    );
  }

  if (isMobile) {
    return (
      <ListSpotsGridCards
        grid={grid}
        teamsById={teamsById}
        onChange={onChange}
        className={className}
      />
    );
  }

  return (
    <ListSpotsGridTable
      grid={grid}
      teamsById={teamsById}
      onChange={onChange}
      className={className}
    />
  );
};
