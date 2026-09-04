"use client";

import { TeamType } from "@/app/api/type/common";
import { DraftPicksDataType } from "@/app/api/type/draftpicks";
import { PlayerDatabaseType } from "@/app/api/type/player";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { ElementType, ReactNode, useEffect, useMemo, useState } from "react";
import PlayerSelect, { PlayerSource } from "../father-son/PlayerSelect";
import { TradeClubFlag } from "./TradeClubFlag";
import { GroupedTradePicks, TradeLane } from "./type";
import { clubShortName, formatPoints } from "./util";

export type TradeAddTab = "picks" | "players";

const ALL_CLUBS_FILTER = "all";

const FilterChip = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex h-[26px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[10.5px] font-bold",
      selected
        ? "border-highlight-text bg-highlight-text/10 text-highlight-text"
        : "border-border bg-card text-muted-foreground",
    )}
  >
    {children}
  </button>
);

export const TradeAddSheet = ({
  open,
  lane,
  tab,
  lanes,
  teamsById,
  groupedPicks,
  picksLoading,
  playerSource,
  onPlayerSourceChange,
  talentOrderId,
  talentOrderOptions,
  onTalentOrderChange,
  playersOptions,
  selectedPlayerIds,
  onClose,
  onAddPick,
  onAddPlayer,
  onTabChange,
}: {
  open: boolean;
  lane: TradeLane;
  tab: TradeAddTab;
  lanes: TradeLane[];
  teamsById: Map<string, TeamType>;
  groupedPicks: GroupedTradePicks[];
  picksLoading: boolean;
  playerSource: PlayerSource;
  onPlayerSourceChange: (source: PlayerSource) => void;
  talentOrderId: string;
  talentOrderOptions: SelectOption[];
  onTalentOrderChange: (value: string) => void;
  playersOptions: PlayerDatabaseType[];
  selectedPlayerIds: Set<string>;
  onClose: () => void;
  onAddPick: (pick: DraftPicksDataType) => void;
  onAddPlayer: (player: PlayerDatabaseType) => void;
  onTabChange: (tab: TradeAddTab) => void;
}) => {
  const isMobile = useIsMobile();
  const receiving = teamsById.get(lane.teamId);
  const [pickSearch, setPickSearch] = useState("");
  const [clubFilter, setClubFilter] = useState(ALL_CLUBS_FILTER);

  const selectedClubs = useMemo(
    () =>
      lanes
        .map((item) => teamsById.get(item.teamId))
        .filter((team): team is TeamType => Boolean(team)),
    [lanes, teamsById],
  );

  const selectedClubIds = useMemo(
    () => new Set(selectedClubs.map((club) => String(club.id))),
    [selectedClubs],
  );

  useEffect(() => {
    if (!open) {
      setPickSearch("");
      setClubFilter(ALL_CLUBS_FILTER);
    }
  }, [open]);

  useEffect(() => {
    if (clubFilter !== ALL_CLUBS_FILTER && !selectedClubIds.has(clubFilter)) {
      setClubFilter(ALL_CLUBS_FILTER);
    }
  }, [clubFilter, selectedClubIds]);

  const filteredPickGroups = useMemo(() => {
    const query = pickSearch.trim().toLowerCase();

    return groupedPicks
      .filter((group) => selectedClubIds.has(group.clubId))
      .filter(
        (group) =>
          clubFilter === ALL_CLUBS_FILTER || group.clubId === clubFilter,
      )
      .map((group) => {
        const picks = group.years
          .flatMap((year) => year.picks)
          .filter((pick) => {
            if (!query) return true;
            return pick.label.toLowerCase().includes(query);
          })
          .sort((a, b) => a.year - b.year || a.overallPick - b.overallPick);

        return {
          clubId: group.clubId,
          clubName: group.clubName,
          picks,
        };
      })
      .filter((group) => group.picks.length > 0);
  }, [clubFilter, groupedPicks, pickSearch, selectedClubIds]);

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  const contentProps = {
    onOpenAutoFocus: (event: Event) => event.preventDefault(),
    onCloseAutoFocus: (event: Event) => event.preventDefault(),
    onPointerDownOutside: (event: { target: EventTarget | null; preventDefault: () => void }) => {
      const target = event.target as HTMLElement;
      if (target.closest('[role="menu"]')) {
        event.preventDefault();
      }
    },
  };

  const body = (Title: ElementType, Description: ElementType) => (
    <>
      {isMobile ? (
        <div className="flex justify-center pb-1 pt-2">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>
      ) : null}
      <div className="flex items-center gap-2.5 border-b border-border px-[18px] py-3.5">
        <div className="min-w-0 flex-1">
          <Title className="mb-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.9px] text-highlight-text">
            Add to trade
          </Title>
          <Description className="sr-only">
            Choose picks or players for {receiving?.teamNames ?? "this club"} to
            receive.
          </Description>
          <div className="flex items-center gap-1.5 text-[14.5px] font-extrabold text-foreground">
            <TradeClubFlag team={receiving} />
            <span className="truncate">
              {receiving?.teamNames ?? "Club"} receives…
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as TradeAddTab)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="px-[18px] pt-2.5">
            <TabsList className="h-auto w-full rounded-lg border border-border bg-muted p-[3px]">
              <TabsTrigger
                value="picks"
                className="h-7 flex-1 text-[11px] font-extrabold data-[state=active]:text-highlight-text"
              >
                Picks
              </TabsTrigger>
              <TabsTrigger
                value="players"
                className="h-7 flex-1 text-[11px] font-extrabold data-[state=active]:text-highlight-text"
              >
                Players
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="picks"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-[18px] pt-2.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={pickSearch}
                  onChange={(event) => setPickSearch(event.target.value)}
                  placeholder="Filter picks…"
                  className="h-[34px] rounded-lg border-border bg-muted pl-8 text-[12.5px] shadow-none"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto">
                <FilterChip
                  selected={clubFilter === ALL_CLUBS_FILTER}
                  onClick={() => setClubFilter(ALL_CLUBS_FILTER)}
                >
                  All in trade
                </FilterChip>
                {selectedClubs.map((club) => (
                  <FilterChip
                    key={String(club.id)}
                    selected={clubFilter === String(club.id)}
                    onClick={() => setClubFilter(String(club.id))}
                  >
                    <TradeClubFlag
                      team={club}
                      size="sm"
                      className="h-[13px] w-[13px]"
                    />
                    {clubShortName(club)}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-[18px] py-3">
              {picksLoading ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  Loading picks…
                </p>
              ) : !filteredPickGroups.length ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No picks match this filter.
                </p>
              ) : (
                filteredPickGroups.map((group) => (
                  <div key={group.clubId} className="mb-3 last:mb-0">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <TradeClubFlag
                        team={teamsById.get(group.clubId)}
                        size="sm"
                      />
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                        {group.clubName}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="overflow-hidden rounded-[9px] border border-border bg-muted/60">
                      {group.picks.map((pick, index) => (
                        <button
                          key={pick.unique}
                          type="button"
                          disabled={pick.disabled}
                          onClick={() => onAddPick(pick)}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-3 py-2.5 text-left",
                            index > 0 && "border-t border-border",
                            pick.disabled
                              ? "cursor-not-allowed opacity-55"
                              : "hover:bg-secondary/80",
                          )}
                        >
                          <span className="min-w-0 truncate text-[12.5px] font-bold tabular-nums text-foreground">
                            {pick.label}
                          </span>
                          {pick.disabled ? (
                            <span className="shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[9.5px] font-bold text-muted-foreground">
                              in trade
                            </span>
                          ) : null}
                          <span className="flex-1" />
                          <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-muted-foreground">
                            {formatPoints(pick.value)} pts
                          </span>
                          {!pick.disabled ? (
                            <span className="shrink-0 text-[13px] font-extrabold text-highlight-text">
                              +
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="players"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden px-[18px] py-3"
          >
            <PlayerSelect
              variant="inline"
              showLabel={false}
              playerSource={playerSource}
              setPlayerSource={onPlayerSourceChange}
              talentOrderOptions={talentOrderOptions}
              talentOrderId={talentOrderId}
              onTalentOrderChange={onTalentOrderChange}
              playersOptions={playersOptions}
              onSelect={(playerId) => {
                const player = playersOptions.find(
                  (item) => String(item.id) === String(playerId),
                );
                if (player) onAddPlayer(player);
              }}
              disabledIds={selectedPlayerIds}
              teamsById={teamsById}
            />
            <p className="mt-2 text-[10.5px] leading-normal text-muted-foreground">
              Adding a player whose club isn’t in the trade brings that club in
              automatically.
            </p>
          </TabsContent>
        </Tabs>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          overlayClassName="z-[60] bg-black/45"
          className="z-[60] flex h-[88dvh] flex-col gap-0 overflow-hidden rounded-t-[20px] border-border bg-card p-0 [&>button]:hidden"
          {...contentProps}
        >
          {body(SheetTitle, SheetDescription)}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="z-[60] bg-black/45"
        className="z-[60] flex h-[min(640px,86vh)] w-[420px] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)] [&>button]:hidden"
        {...contentProps}
      >
        {body(DialogTitle, DialogDescription)}
      </DialogContent>
    </Dialog>
  );
};
