"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useFatherSonBidMatchModal } from "./hook";
import { cn } from "@/lib/utils";
import { buildAfterChips, buildBeforeChips, playerName } from "./util";
import { SummaryCard } from "./SummaryCard";
import { StatsGrid } from "./StatsGrid";
import { PointsLedger } from "./PointsLedger";
import { CompensationCard } from "./CompensationCard";
import { EmptyState } from "./EmptyState";
import { FutureHandsSection } from "./FutureHandSection";
import { DraftHandSection } from "./DraftHandSection";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { Form } from "@/components/ui/form";
import { DisplayStateToolbar } from "./DisplayStateToolbar";
import { DisplayStateKey } from "./type";
import PlayerSelect from "./PlayerSelect";
import { useIsMobile } from "@/hooks/use-mobile";
import ActionButton from "./ActionButton";

type FatherSonBidMatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FatherSonBidMatchModal = ({
  isOpen,
  onClose,
}: FatherSonBidMatchModalProps) => {
  const {
    readyToFetch,
    selectedPlayer,
    bidTeam,
    displayedImpact,
    error,
    fsTeam,
    handleClose,
    loading,
    form,
    selectedProject,
    playerSource,
    talentOrderId,
    talentOrderOptions,
    playersOptions,
    setPlayerSource,
    setTalentOrderId,
    teamsOptions,
    allDraftPicksOptions,
  } = useFatherSonBidMatchModal({
    onClose,
  });
  const isMobile = useIsMobile();
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black p-6 pt-17.5 outline-none",
            isMobile && "pt-17.75 pr-0 pb-0 pl-0",
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Father Son Bid Match</DialogTitle>
          <DisplayStateToolbar
            active={displayedImpact?.displayState as DisplayStateKey}
          />
          <div
            className={cn(
              "flex h-full max-h-220 w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-card shadow-[0_40px_90px_-24px_rgba(0,0,0,0.6)]",
              isMobile && "rounded-t-[20px] rounded-b-none",
            )}
          >
            <div className="flex items-center gap-4 border-b border-border px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-highlight-text">
                  Transaction · Father Son Bid Match
                </div>
                <div className="truncate text-xl font-extrabold tracking-tight text-foreground">
                  {displayedImpact
                    ? `Match ${bidTeam?.teamNames ?? "bid"} bid on ${
                        selectedPlayer ? playerName(selectedPlayer) : "player"
                      }`
                    : "Father Son Bid Match"}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                  {fsTeam?.teamNames ?? "Select a club"} ·{" "}
                  {selectedProject?.projectName}
                </div>
              </div>

              {displayedImpact && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold",
                    displayedImpact.canProceed
                      ? "border-success-border bg-success-surface text-success"
                      : "border-destructive/30 bg-destructive/10 text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      displayedImpact.canProceed
                        ? "bg-success"
                        : "bg-destructive",
                    )}
                  />
                  {displayedImpact.canProceed ? "Can match" : "Cannot match"}
                </div>
              )}

              <DialogPrimitive.Close asChild>
                <button
                  aria-label="Close"
                  className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <div
              className={cn(
                "grid min-h-0 flex-1 grid-cols-[0.8fr_1.2fr]",
                isMobile && "flex flex-col overflow-auto",
              )}
            >
              <Form {...form}>
                <div
                  className={cn(
                    "flex flex-col gap-2 overflow-auto border-r border-border bg-secondary/40 p-5",
                    isMobile && "overflow-visible border-r-0 border-b",
                  )}
                >
                  <FormSelectField
                    label="Father-son club"
                    control={form.control}
                    name="fsTeamId"
                    options={teamsOptions}
                  />
                  <PlayerSelect
                    form={form}
                    playerSource={playerSource}
                    setPlayerSource={setPlayerSource}
                    talentOrderOptions={talentOrderOptions}
                    talentOrderId={talentOrderId}
                    playersOptions={playersOptions}
                  />
                  <FormSelectField
                    label="Bid pick"
                    control={form.control}
                    isSearchable
                    name="pickId"
                    options={allDraftPicksOptions}
                  />

                  <div className="my-1 h-px bg-border" />

                  {displayedImpact && (
                    <>
                      {isMobile && <SummaryCard impact={displayedImpact} />}
                      <div className={cn(isMobile && "border p-3 rounded-2xl")}>
                        <DraftHandSection
                          title="Draft hand · Current"
                          chips={buildBeforeChips(displayedImpact)}
                          variant="before"
                        />
                        <DraftHandSection
                          title="Draft hand · After match"
                          chips={buildAfterChips(displayedImpact)}
                          variant="after"
                        />
                        <FutureHandsSection impact={displayedImpact} />
                      </div>
                    </>
                  )}
                </div>
              </Form>
              <div
                className={cn(
                  "flex flex-col gap-4 overflow-auto p-5",
                  isMobile && "overflow-visible",
                )}
              >
                {!displayedImpact && !readyToFetch && (
                  <EmptyState message="Select a club, player, and bid pick to see the match impact." />
                )}
                {readyToFetch && loading && (
                  <EmptyState message="Calculating impact…" />
                )}
                {readyToFetch && error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {displayedImpact && (
                  <>
                    {!isMobile && <SummaryCard impact={displayedImpact} />}

                    <StatsGrid impact={displayedImpact} />
                    <PointsLedger impact={displayedImpact} />
                    <CompensationCard impact={displayedImpact} />
                  </>
                )}
              </div>
            </div>

            <ActionButton
              handleClose={handleClose}
              displayedImpact={displayedImpact}
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default FatherSonBidMatchModal;
