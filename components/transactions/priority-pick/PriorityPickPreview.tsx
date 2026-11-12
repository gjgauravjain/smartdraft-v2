"use client";

import { TeamType } from "@/app/api/type/common";
import { PriorityPickStatusView } from "./type";
import {
  DraftPointsLine,
  PickHand,
  StatusLine,
  SuccessLine,
} from "./PriorityPickPreviewParts";

type PriorityPickPreviewProps = {
  status: PriorityPickStatusView;
  team: TeamType | null;
  draftYear: number | null;
  isMobile: boolean;
};

export const PriorityPickPreview = ({
  status,
  team,
  draftYear,
  isMobile,
}: PriorityPickPreviewProps) => {
  if (status.kind === "success") {
    return (
      <div className="flex flex-col gap-3 border-t border-border pt-3.5">
        <SuccessLine message={status.impact.impactDescription} />
        <DraftPointsLine impact={status.impact} />
        <PickHand
          impact={status.impact}
          team={team}
          draftYear={draftYear}
          isMobile={isMobile}
        />
      </div>
    );
  }

  return <StatusLine status={status} />;
};
