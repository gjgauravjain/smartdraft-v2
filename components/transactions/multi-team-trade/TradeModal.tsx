"use client";

import { TeamType } from "@/app/api/type/common";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useTradeModal } from "./hook";
import { TradeAddSheet, TradeAddTab } from "./TradeAddSheet";
import { TradeClubLanes } from "./TradeClubLanes";
import { TradeImpact } from "./TradeImpact";
import { FALLBACK_ADD_LANE, tradeFooterNote } from "./util";
import { TradeHeader } from "./trade/TradeHeader";
import { TradeFooter } from "./trade/TradeFooter";

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
            className="flex h-[92dvh] rounded-t-[16px] flex-col gap-0 border-border bg-card p-0 [&>button]:hidden"
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

export default TradeModal;
