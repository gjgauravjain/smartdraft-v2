export type FreeAgentCompensationFormInput = {
  club: string;
  pickType: string;
  alignedPick: string;
  insert: string;
  overallPick: string;
  playerId: string;
};

export type FreeAgentCompensationInsert = "Before" | "After";

export type FreeAgentCompensationRequest = {
  teamid: string;
  pick_type: string;
  pick_id: string;
  unique_pick: string;
  instructions: FreeAgentCompensationInsert;
  reason: string;
  player_id: number | string;
  overall_pick?: number;
};

export type FreeAgentHandPick = {
  pick: string | number;
  pickStatus: string;
  pickName: string;
  isNew: boolean;
};

export type FreeAgentCompensationImpact = {
  impactDescription: string;
  teamDraftPointsStart: number | null;
  teamDraftPointsEnd: number | null;
  teamDraftPointsImpact: number | null;
  currentYearPicks: FreeAgentHandPick[];
  nextYearPicks: FreeAgentHandPick[];
  currentYearPicksPts: number | null;
  nextYearPicksPts: number | null;
};

export type FreeAgentCompensationFieldName = keyof FreeAgentCompensationFormInput;

export type FreeAgentCompensationFieldErrors = Partial<
  Record<FreeAgentCompensationFieldName, string>
>;

export type FreeAgentCompensationPreviewResult =
  | { kind: "success"; impact: FreeAgentCompensationImpact }
  | {
      kind: "field";
      messages: string[];
      fieldErrors: FreeAgentCompensationFieldErrors;
    }
  | { kind: "server"; message: string };

export type FreeAgentCompensationScope = {
  projectId: number;
  scenarioId?: string;
  transactionNo?: string;
};
