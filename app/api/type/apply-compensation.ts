export type ApplyCompensationScope = {
  projectId: number;
  scenarioId?: string;
  transactionNo?: string;
};

export type ApplyCompensationPick = {
  teamId: number | null;
  teamName: string;
  label: string;
  overallPick: number | null;
  slideSummary: string | null;
  removedPicks: string[];
};

export type ApplyCompensationImpact = {
  picks: ApplyCompensationPick[];
};
