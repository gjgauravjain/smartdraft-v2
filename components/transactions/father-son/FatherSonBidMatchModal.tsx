"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

type FatherSonBidMatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FatherSonBidMatchModal = ({
  isOpen,
  onClose,
}: FatherSonBidMatchModalProps) => {
  const {
    players,
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
    teamsOptions,
    allDraftPicksOptions,
  } = useFatherSonBidMatchModal({
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex items-center justify-center bg-black p-6 pt-17.5 outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">Father Son Bid Match</DialogTitle>
          <DisplayStateToolbar
            active={displayedImpact?.displayState as DisplayStateKey}
          />
          <div className="flex h-full max-h-220 w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-card shadow-[0_40px_90px_-24px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-4 border-b border-border px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
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

            <div className="grid min-h-0 flex-1 grid-cols-[0.8fr_1.2fr]">
              <Form {...form}>
                <div className="flex flex-col gap-2 overflow-auto border-r border-border bg-secondary/40 p-5">
                  <FormSelectField
                    label="Father-son club"
                    control={form.control}
                    name="fsTeamId"
                    options={teamsOptions}
                  />
                  <FormSelectField
                    label="Player"
                    control={form.control}
                    name="playerId"
                    options={(players ?? []).map((p: any) => ({
                      value: String(p.id),
                      label: playerName(p),
                    }))}
                    isSearchable
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
                    </>
                  )}
                </div>
              </Form>
              <div className="flex flex-col gap-4 overflow-auto p-5">
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
                    <SummaryCard impact={displayedImpact} />
                    <StatsGrid impact={displayedImpact} />
                    <PointsLedger impact={displayedImpact} />
                    <CompensationCard impact={displayedImpact} />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-border bg-secondary/40 px-6 py-3.5">
              <div className="flex-1" />
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                disabled={!displayedImpact || !displayedImpact.canProceed}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  handleClose();
                }}
              >
                Match bid
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default FatherSonBidMatchModal;
