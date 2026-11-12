export type InsertPickPosition = "Before" | "After";

export type InsertPickRequestPayload = {
  team: number;
  aligned_pick: string;
  position: InsertPickPosition;
  reason: string;
};
