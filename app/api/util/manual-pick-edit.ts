import {
  ManualPickEditReason,
  ManualPickEditRequestPayload,
} from "../type/manual-pick-edit";

export const buildManualPickEditRequestPayload = ({
  pickLabel,
  uniquePick,
  newOwnerId,
  viaOwnerId,
  reason,
}: {
  pickLabel: string;
  uniquePick: string;
  newOwnerId: string;
  viaOwnerId?: string;
  reason: ManualPickEditReason;
}): ManualPickEditRequestPayload => ({
  pick: pickLabel,
  unique_pick: uniquePick,
  team_new: Number(newOwnerId),
  team_via: viaOwnerId ? Number(viaOwnerId) : null,
  reason,
});
