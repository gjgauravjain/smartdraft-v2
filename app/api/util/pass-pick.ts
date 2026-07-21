import {
  PassPickImpactResponse,
  PassPickPassType,
  PassPickRequestPayload,
} from "../type/pass-pick";

export const transformPassPickImpactResponse = (
  response: {
    pass_summary?: string;
    picks_passed?: string[];
  } | null,
): PassPickImpactResponse | null => {
  if (!response) {
    return null;
  }

  return {
    passSummary: response.pass_summary ?? "",
    picksPassed: response.picks_passed ?? [],
  };
};

export const buildPassPickRequestPayload = ({
  pickId,
  passType,
}: {
  pickId: string;
  passType: PassPickPassType;
}): PassPickRequestPayload => ({
  pick_id: pickId,
  pass_type: passType,
});
