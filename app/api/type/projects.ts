
export type ProjectType = {
  id: string;
  projectName: string;
  projectDesc: string;
  teamId: string;
  file: string | null;
  year: string;
  draftType: string;
  draftValueIndexType: string;
  biddingDiscountType: string;
  draftLadder: Record<string, number>;
  user: number;
};