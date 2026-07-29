export type YearPickDict = {
  pick: string;
  pickStatus: string;
  pickDisplay?: string;
  clubPickNumber: number;
};

export type FlagTooltipType = {
  currentYear: string;
  currentYearPicks: string;
  currentYearsPts: number;
  currentYearPtsDiff: string;
  currentYearPickDict: YearPickDict[];
  currentYearPtsRemaining: string;
  currentYearRosterSpots: string;
  currentYearPickRemaining: string;
  nextYear: string;
  nextYearPicks: string;
  nextYearPicksDict: YearPickDict[];
  nextYersPts: number;
  nextYearPtsDiff: string;
  nextYearPtsRemaining: string;
  thirdYear: string;
  thirdYearPicks: string;
  thirdYearPicksDict: YearPickDict[];
  thirdYearPtsRemaining: string;
  thirdYearPts: number;
  thirdYearPtsDiff: string;
  picksUsed: number;
  teamId: number;
  teamName: string;
  id: number;
  transactionNetResult: string;
};
