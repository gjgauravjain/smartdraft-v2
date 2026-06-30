import { SelectOption } from "../common/fields/FormSelectField";
import { CreateUserFormValues, OrganisationOption, TeamOption } from "./util";

export type CreateUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: TeamOption[];
  tiers: SelectOption[];
  organisations: OrganisationOption[];
  defaultValues?: Partial<CreateUserFormValues>;
};
