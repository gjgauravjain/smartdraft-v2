export type PassPickPassType = "ONE" | "ALL";

export type PassPickRequestPayload = {
  pick_id: string;
  pass_type: PassPickPassType;
};

export type PassPickImpactResponse = {
  passSummary: string;
  picksPassed: string[];
};
