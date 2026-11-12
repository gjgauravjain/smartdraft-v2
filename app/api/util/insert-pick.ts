import {
  InsertPickPosition,
  InsertPickRequestPayload,
} from "../type/insert-pick";

export const buildInsertPickRequestPayload = ({
  teamId,
  alignedPick,
  position,
  reason,
}: {
  teamId: string;
  alignedPick: string;
  position: InsertPickPosition;
  reason: string;
}): InsertPickRequestPayload => ({
  team: Number(teamId),
  aligned_pick: alignedPick,
  position,
  reason,
});
