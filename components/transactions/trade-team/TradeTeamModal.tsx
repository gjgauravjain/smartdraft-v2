"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { TradeTeamActions } from "./TradeTeamActions";
import { TradeTeamHand } from "./TradeTeamHand";
import { TradeTeamLanes } from "./TradeTeamLanes";
import { TradeTeamPicker } from "./TradeTeamPicker";
import { TradeTeamStatus } from "./TradeTeamStatus";
import { TradeTeamModalHeader } from "./commonTradeComponent/TradeTeamModalHeader";
import { useTradeTeamModal } from "./hook";

type TradeTeamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scenarioId?: string;
  transactionNo?: string;
};

const TradeTeamModal = ({
  isOpen,
  onClose,
  scenarioId,
  transactionNo,
}: TradeTeamModalProps) => {
  const isMobile = useIsMobile();
  const modal = useTradeTeamModal({ onClose, scenarioId, transactionNo });

  const onOpenChange = (open: boolean) => {
    if (!open) modal.handleClose();
  };

  const body = (
    <>
      <TradeTeamLanes
        lanes={modal.lanes}
        teams={modal.teams}
        points={modal.points}
        impact={modal.impact}
        isMobile={isMobile}
        onClubChange={modal.setClub}
        onRemoveClub={modal.removeClub}
        onRemovePick={modal.removePick}
        onRemovePlayer={modal.removePlayer}
        onAdd={modal.openPicker}
        onAddClub={modal.addClub}
        previewPending={modal.previewPending}
      />
      <TradeTeamStatus status={modal.status} />
      <TradeTeamHand
        impact={modal.impact}
        teams={modal.teamsMap}
        projectYear={modal.projectYear}
        open={modal.showHand}
        teamId={modal.handTeamId}
        isMobile={isMobile}
        onToggle={() => modal.setShowHand(!modal.showHand)}
        onTeam={modal.setHandTeamId}
      />
    </>
  );

  const picker = modal.pickerLane ? (
    <TradeTeamPicker
      clubName={
        modal.teamsMap.get(modal.pickerLane.teamId)?.teamNames || "Club"
      }
      tab={modal.pickerTab}
      groups={modal.pickerGroups}
      activeClubId={modal.activeClubId}
      years={modal.pickerYears}
      picksLoading={modal.picksLoading}
      isMobile={isMobile}
      takenUniques={modal.takenUniques}
      selectedPicks={modal.selectedPicks}
      selectedPlayers={modal.selectedPlayers}
      selectedCount={modal.selectedCount}
      teamsMap={modal.teamsMap}
      playerQuery={modal.playerQuery}
      visiblePlayers={modal.visiblePlayers}
      playersLoading={modal.playersLoading}
      playersSearching={modal.playersSearching}
      onTab={modal.setPickerTab}
      onClub={modal.setPickerClubId}
      onTogglePick={modal.togglePick}
      onTogglePlayer={modal.togglePlayer}
      onPlayerQuery={modal.setPlayerQuery}
      onClose={modal.closePicker}
      onAdd={modal.commitPicker}
    />
  ) : null;

  const frame = (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <TradeTeamModalHeader onClose={modal.handleClose} desktop={!isMobile} />
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted px-4 py-3 sm:px-5">
        {body}
      </div>
      <TradeTeamActions
        canConfirm={modal.canConfirm}
        isSubmitting={modal.isSubmitting}
        isMobile={isMobile}
        onClose={modal.handleClose}
        onConfirm={modal.handleConfirm}
      />
      {picker}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[85dvh] max-h-[85dvh] flex-col gap-0 overflow-hidden rounded-t-2xl border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">New trade</SheetTitle>
          {frame}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
        className="flex max-h-[85dvh] w-230 max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_16px_48px_rgba(0,0,0,0.16)] [&>button]:hidden"
      >
        <DialogDescription className="sr-only">
          Build a trade between two or more clubs, then confirm it.
        </DialogDescription>
        {frame}
      </DialogContent>
    </Dialog>
  );
};

export default TradeTeamModal;