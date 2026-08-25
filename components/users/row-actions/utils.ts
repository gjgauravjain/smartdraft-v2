import { SelectOption } from "@/components/common/fields/FormSelectField";
import { TeamOption, toTeamSelectOptions } from "@/components/users/util";

export const getEditTeamOptions = (
  teams: TeamOption[],
  currentTeamId: string,
): SelectOption[] => {
  const options = toTeamSelectOptions(teams);

  if (!currentTeamId || options.some((option) => option.value === currentTeamId)) {
    return options;
  }

  return [
    ...options,
    {
      value: currentTeamId,
      label: `Current team (${currentTeamId})`,
    },
  ];
};
