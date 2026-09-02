export type MovePickPosition = "Before" | "After";

export type MovePickRequestPayload = {
  pick: string;
  destination_pick: string;
  position: MovePickPosition;
  reason: string;
};
