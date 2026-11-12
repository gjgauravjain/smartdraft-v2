export type PriorityPickFormInput = {
  club: string;
  pickType: string;
  alignedPick: string;
  insert: string;
  overallPick: string;
  reason: string;
};

export type PriorityPickInsert = "Before" | "After";

export type PriorityPickRequest = {
  projectId: number;
  teamid: string;
  pick_type: string;
  ppid: string;
  unique_pick: string;
  pp_insert_instructions: PriorityPickInsert;
  reason: string;
  overall_pick?: number;
};

export type PriorityPickHandPick = {
  pick: string | number;
  pickStatus: string;
  pickName: string;
  isNew: boolean;
};

export type PriorityPickImpact = {
  impactDescription: string;
  teamDraftPointsStart: number | null;
  teamDraftPointsEnd: number | null;
  teamDraftPointsImpact: number | null;
  currentYearPicks: PriorityPickHandPick[];
  nextYearPicks: PriorityPickHandPick[];
  currentYearPicksPts: number | null;
  nextYearPicksPts: number | null;
};

export type PriorityPickFieldName = keyof PriorityPickFormInput;

export type PriorityPickFieldErrors = Partial<
  Record<PriorityPickFieldName, string>
>;

export type PriorityPickPreviewResult =
  | { kind: "success"; impact: PriorityPickImpact }
  | {
      kind: "field";
      messages: string[];
      fieldErrors: PriorityPickFieldErrors;
    }
  | { kind: "server"; message: string };

export type PriorityPickScope = {
  projectId: number;
  scenarioId?: string;
  transactionNo?: string;
};
