export interface OverallImpactItem {
  overallPick: string;
  aflPointsValue: string;
  displayNameDetailed: string;
  cumulativePts: number;
  payoffDiff: string;
  aflPtsLeft: number;
  action: string;
  deficitAmount: string;
  newPickNo?: number;
  newRdNo?: number;
  picksShuffledPointsValue?: number;
  newPickPtsValue?: number;
}

export interface DraftHandPick {
  overallPick: string | number;
  pickStatus: string;
  year: string | number;
  draftRoundInt: string | number;
  yearType: "Current" | "Next";
}

export interface CompensationPick {
  teamId: number;
  teamName: string;
  finishingPosition: number;
  slideSpots: number;
  r1PickUsed: boolean;
  status: string;
  insertRelativeToR2: string;
}

export type DeficitImpactType = {
  year: string[];
  overallPick: number[];
  draftRoundInt: number[];
  aflPointsValue: number[];
  maxDeficitPoints: number[];
  pointsRemaining: number[];
  pointsSubtracted: number[];
  newOverallPick: number[];
};

export type ImpactVisualType = {
  firstValue: number | string | null;
  firstValueTooltip: string | null;
  pointsRemaining: number | string;
  prefix: string | null;
  secondValue: number | string | null;
  summary: string;

  deficitSummary?: string;
  deficitWarning?: string;
  deficitYear?: number;
  pointsDeficit?: number;

  deficitExceedsCap?: boolean;
  allowableDeficitPoints?: number;
  missingNextYearFirstRounder?: boolean;

  deficitImpact?: DeficitImpactType;
};

export interface FatherSonBidImpactResponse {
  fsTeam: number;
  playerId: string;
  bidTeam: number;
  bidPickNo: string;
  bidSummary: string;
  bidSummary2: string;
  pointsRequired: number;
  listSpotsAvailable: number;
  picksUsed: number;
  picksAvailable: number;
  draftSurplus: number;
  overallImpactDict: OverallImpactItem[];
  initialDraftHand: DraftHandPick[];
  newDraftHand: DraftHandPick[];
  overallImpactVisual: ImpactVisualType[];
  compensationPicks2026: CompensationPick[];
  canProceed: boolean;
  displayState: string;
}
