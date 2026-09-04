import { TeamType } from "@/app/api/type/common";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { TradeClubFlag } from "../TradeClubFlag";
import { validityBadgeClass } from "../util";
import { Plus, X } from "lucide-react";

export const TradeHeader = ({
  isMobile,
  projectLabel,
  selectedClubs,
  validity,
  showValidity,
  onAddClub,
  onClose,
}: {
  isMobile: boolean;
  projectLabel: string;
  selectedClubs: TeamType[];
  validity?: "Valid" | "Warning" | "Invalid";
  showValidity: boolean;
  onAddClub: () => void;
  onClose: () => void;
}) => (
  <div
    className={cn(
      "flex shrink-0 items-center gap-3 border-b border-border",
      isMobile ? "px-4 pb-3 pt-2" : "px-6 py-3",
    )}
  >
    {isMobile ? (
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-[9px] font-extrabold uppercase tracking-widest text-highlight-text">
          Transaction · Trade
        </div>
        <div className="text-base font-extrabold text-foreground">
          New trade
        </div>
        <div className="mt-px truncate text-[11px] text-muted-foreground">
          {projectLabel}
        </div>
      </div>
    ) : (
      <div className="flex min-w-0 flex-1 items-baseline gap-2.5">
        <span className="whitespace-nowrap text-lg font-extrabold tracking-tight text-foreground">
          New trade
        </span>
        <span className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-widest text-highlight-text">
          Transaction · Trade
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {projectLabel} · Project board
        </span>
      </div>
    )}

    {selectedClubs.length >= 2 ? (
      isMobile ? (
        <div className="flex shrink-0 items-center">
          {selectedClubs.map((club, index) => (
            <span
              key={club.id}
              className={cn(
                "flex rounded-full ring-2 ring-card",
                index > 0 && "-ml-1.5",
              )}
            >
              <TradeClubFlag
                team={club}
                className="h-[18px] w-[18px] border-[1.5px]"
              />
            </span>
          ))}
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-[7px]">
          {selectedClubs.map((club, index) => (
            <Fragment key={club.id}>
              {index > 0 ? (
                <span className="text-[13px] font-semibold text-muted-foreground">
                  ⇄
                </span>
              ) : null}
              <TradeClubFlag team={club} className="h-5 w-5" />
            </Fragment>
          ))}
        </div>
      )
    ) : null}

    {showValidity && validity ? (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold",
          validityBadgeClass(validity),
        )}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {validity}
      </span>
    ) : null}

    <button
      type="button"
      onClick={onAddClub}
      className="inline-flex h-[30px] shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-3 text-[11.5px] font-bold text-muted-foreground hover:text-foreground"
    >
      <Plus className="h-3 w-3" />
      {isMobile ? "Club" : "Add club"}
    </button>

    {!isMobile ? (
      <button
        type="button"
        onClick={onClose}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-secondary"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    ) : null}
  </div>
);
