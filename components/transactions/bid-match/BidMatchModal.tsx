"use client";

import { BidMatchKind } from "@/app/api/type/transaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { BidMatchActions } from "./BidMatchActions";
import { BidMatchCompensation } from "./BidMatchCompensation";
import { BidMatchCost } from "./BidMatchCost";
import { BidMatchFields } from "./BidMatchFields";
import { BidMatchHand } from "./BidMatchHand";
import { BidMatchHeadline } from "./BidMatchHeadline";
import { BidMatchStatus } from "./BidMatchStatus";
import { useBidMatchModal } from "./hook";
import { BidMatchHeader } from "./BidMatchHeader";

type BidMatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bidType: BidMatchKind;
  scenarioId?: string;
  transactionNo?: string;
};

const BidMatchModal = ({
  isOpen,
  onClose,
  bidType,
  scenarioId,
  transactionNo,
}: BidMatchModalProps) => {
  const isMobile = useIsMobile();
  const modal = useBidMatchModal({
    isOpen,
    onClose,
    bidType,
    scenarioId,
    transactionNo,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) modal.handleClose();
  };

  const body = (
    <div className="grid gap-3.5">
      <Form {...modal.form}>
        <BidMatchFields
          control={modal.form.control}
          clubLabel={modal.config.clubLabel}
          clubOptions={modal.clubOptions}
          playerOptions={modal.playerOptions}
          pickOptions={modal.pickOptions}
          clubsLoading={modal.clubsLoading}
          playersLoading={modal.playersLoading}
          picksLoading={modal.picksLoading}
        />
      </Form>
      {modal.previewLoading ? (
        <p className="text-xs text-muted-foreground">Checking the match.</p>
      ) : null}
      {modal.previewError ? (
        <p className="text-xs text-destructive">{modal.previewError}</p>
      ) : null}
      {!modal.ready && !modal.previewError ? (
        <p className="text-xs text-muted-foreground">
          Choose a club, player, and bid pick to see the match.
        </p>
      ) : null}
      {modal.result ? (
        <div className="grid gap-3.5">
          <BidMatchHeadline result={modal.result} />
          <BidMatchStatus result={modal.result} />
          <BidMatchCost result={modal.result} />
          <BidMatchHand result={modal.result} isMobile={isMobile} />
          <BidMatchCompensation compensation={modal.result.compensation} />
        </div>
      ) : null}
    </div>
  );

  const actions = (
    <BidMatchActions
      isMobile={isMobile}
      canMatch={modal.canMatch}
      isSubmitting={modal.isSubmitting}
      saveError={modal.saveError}
      onClose={modal.handleClose}
      onMatch={() => {
        void modal.handleMatch();
      }}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[85dvh] max-h-[85dvh] flex-col gap-0 overflow-hidden rounded-t-2xl border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">{modal.config.title}</SheetTitle>
          <div className="flex min-h-0 flex-1 flex-col">
            <BidMatchHeader
              eyebrow={modal.config.eyebrow}
              title={modal.config.title}
              onClose={modal.handleClose}
            />
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
              {body}
            </div>
            {actions}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
        className="flex max-h-[85dvh] w-190 max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_16px_48px_rgba(0,0,0,0.16)] [&>button]:hidden"
      >
        <DialogDescription className="sr-only">
          {modal.config.eyebrow}
        </DialogDescription>
        <BidMatchHeader
          eyebrow={modal.config.eyebrow}
          title={modal.config.title}
          onClose={modal.handleClose}
          desktop
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
          {body}
        </div>
        {actions}
      </DialogContent>
    </Dialog>
  );
};

export default BidMatchModal;
