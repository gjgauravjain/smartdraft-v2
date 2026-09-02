import { MovePickPosition, MovePickRequestPayload } from "../type/move-pick";

export const buildMovePickRequestPayload = ({
  pick,
  destinationPick,
  position,
  reason,
}: {
  pick: string;
  destinationPick: string;
  position: MovePickPosition;
  reason: string;
}): MovePickRequestPayload => ({
  pick,
  destination_pick: destinationPick,
  position,
  reason,
});
