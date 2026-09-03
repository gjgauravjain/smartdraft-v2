"use client";

import { TeamType } from "@/app/api/type/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useTradeModal } from "./hook";
import { TradeAddSheet, TradeAddTab } from "./TradeAddSheet";
import { TradeClubFlag } from "./TradeClubFlag";
import { TradeClubLanes } from "./TradeClubLanes";
import { TradeImpact } from "./TradeImpact";
import { TradeLane } from "./type";
import { FALLBACK_ADD_LANE, tradeFooterNote, validityBadgeClass } from "./util";

type TradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TradeModal = ({ isOpen, onClose }: TradeModalProps) => {
  const isMobile = useIsMobile();
  const trade = useTradeModal({ isOpen, onClose });
  const [activeLaneId, setActiveLaneId] = useState(trade.lanes[0]?.id ?? "");
  const [addState, setAddState] = useState<{
    laneId: string;
    tab: TradeAddTab;
  } | null>(null);

  useEffect(() => {
    if (!trade.lanes.some((lane) => lane.id === activeLaneId)) {
      setActiveLaneId(trade.lanes[0]?.id ?? "");
    }
  }, [trade.lanes, activeLaneId]);

  const selectedClubs = trade.lanes
    .map((lane) => trade.teamsById.get(lane.teamId))
    .filter((team): team is TeamType => Boolean(team));

  const addLane = addState
    ? trade.lanes.find((lane) => lane.id === addState.laneId)
    : undefined;

  const footerNote = tradeFooterNote({
    impactLoading: trade.impactLoading,
    impactError: trade.impactError,
    readyToPreview: trade.readyToPreview,
    impactData: trade.impactData,
  });

  const projectLabel = trade.selectedProject
    ? `${trade.selectedProject.year} National Draft`
    : "Project board";

  const onOpenChange = (open: boolean) => {
    if (!open && addState) {
      setAddState(null);
      return;
    }
    if (!open) trade.handleClose();
  };

  const header = (
    <TradeHeader
      isMobile={isMobile}
      projectLabel={projectLabel}
      selectedClubs={selectedClubs}
      validity={trade.impactData?.summaryValidity}
      showValidity={Boolean(trade.impactData) && !trade.impactLoading}
      onAddClub={trade.addClub}
      onClose={trade.handleClose}
    />
  );

  const lanes = (
    <TradeClubLanes
      lanes={trade.lanes}
      options={trade.clubOptions}
      teamsById={trade.teamsById}
      ptsInByLane={trade.ptsInByLane}
      isMobile={isMobile}
      activeLaneId={activeLaneId}
      onSelectLane={setActiveLaneId}
      onClubChange={trade.setClub}
      onRemoveClub={trade.removeClub}
      onRemovePick={trade.removePick}
      onRemovePlayer={trade.removePlayer}
      onAddPick={(laneId) => setAddState({ laneId, tab: "picks" })}
      onAddPlayer={(laneId) => setAddState({ laneId, tab: "players" })}
      impactTeams={trade.impactData?.teams}
    />
  );

  const impactHeadline = (
    <TradeImpact
      impactData={trade.impactData}
      impactLoading={trade.impactLoading}
      impactError={trade.impactError}
      teamsById={trade.teamsById}
      isMobile={isMobile}
      showHeadline
      showDetail={!isMobile}
    />
  );

  const impactDetail = (
    <TradeImpact
      impactData={trade.impactData}
      impactLoading={false}
      impactError={null}
      teamsById={trade.teamsById}
      isMobile={isMobile}
      showHeadline={false}
      showDetail
    />
  );

  const footer = (
    <TradeFooter
      isMobile={isMobile}
      note={footerNote}
      noteTone={
        trade.impactData?.summaryValidity === "Invalid" ? "danger" : "default"
      }
      canConfirm={trade.canConfirm}
      isSubmitting={trade.isSubmitting}
      onCancel={trade.handleClose}
      onConfirm={trade.handleConfirm}
    />
  );

  const addSheet = (
    <TradeAddSheet
      open={Boolean(addState && addLane)}
      lane={addLane ?? FALLBACK_ADD_LANE}
      tab={addState?.tab ?? "picks"}
      lanes={trade.lanes}
      teamsById={trade.teamsById}
      groupedPicks={trade.groupedPicks}
      picksLoading={trade.picksLoading}
      playerSource={trade.playerSource}
      onPlayerSourceChange={trade.setPlayerSource}
      talentOrderId={trade.talentOrderId}
      talentOrderOptions={trade.talentOrderOptions}
      onTalentOrderChange={trade.onTalentOrderChange}
      playersOptions={trade.playersOptions}
      selectedPlayerIds={trade.selectedPlayers}
      onTabChange={(tab) =>
        setAddState((current) => (current ? { ...current, tab } : current))
      }
      onClose={() => setAddState(null)}
      onAddPick={(pick) => {
        if (!addLane) return;
        trade.addPick(addLane.id, pick);
      }}
      onAddPlayer={(player) => {
        if (!addLane) return;
        trade.addPlayer(addLane.id, player);
      }}
    />
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="flex h-[92dvh] flex-col gap-0 border-border bg-card p-0 [&>button]:hidden"
          >
            <SheetTitle className="sr-only">New trade</SheetTitle>
            {header}
            <div className="shrink-0 border-b border-border bg-muted/60 px-3.5 py-3">
              {impactHeadline}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3.5">
              {lanes}
              {impactDetail}
            </div>
            {footer}
          </SheetContent>
        </Sheet>
        {addSheet}
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
          className="flex h-[min(900px,90vh)] w-[min(1080px,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.6)] [&>button]:hidden"
        >
          <DialogTitle className="sr-only">New trade</DialogTitle>
          <DialogDescription className="sr-only">
            Build a trade between two or more clubs.
          </DialogDescription>
          {header}
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto bg-muted/50 px-[22px] py-4">
            {lanes}
            {impactHeadline}
          </div>
          {footer}
        </DialogContent>
      </Dialog>
      {addSheet}
    </>
  );
};

const TradeHeader = ({
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

const TradeFooter = ({
  isMobile,
  note,
  noteTone,
  canConfirm,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  isMobile: boolean;
  note: string;
  noteTone: "default" | "danger";
  canConfirm: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const noteClass = cn(
    noteTone === "danger" ? "text-destructive" : "text-muted-foreground",
  );

  if (isMobile) {
    return (
      <div className="shrink-0 border-t border-border bg-card">
        {note ? (
          <div className={cn("w-full px-4 pt-2 text-[10.5px]", noteClass)}>
            {note}
          </div>
        ) : null}
        <div className="flex gap-[9px] px-4 pb-[22px] pt-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-auto flex-1 rounded-[9px] py-[13px] text-[13.5px] font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canConfirm}
            isLoading={isSubmitting}
            onClick={onConfirm}
            className="h-auto flex-[2] rounded-[9px] py-[13px] text-[13.5px] font-extrabold"
          >
            Confirm trade
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-border bg-muted/50 px-6 py-3.5">
      <div className={cn("min-w-0 flex-1 text-[11.5px]", noteClass)}>
        {note}
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="button"
        disabled={!canConfirm}
        isLoading={isSubmitting}
        onClick={onConfirm}
      >
        Confirm trade
      </Button>
    </div>
  );
};

export default TradeModal;
