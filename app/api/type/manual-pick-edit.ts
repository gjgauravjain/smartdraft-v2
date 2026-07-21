export type ManualPickEditReason = "Carry Over Trade" | "Other";

export type ManualPickEditRequestPayload = {
  pick: string;
  unique_pick: string;
  team_via: number | null;
  team_new: number;
  reason: ManualPickEditReason;
};
