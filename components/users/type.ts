import { OrganisationListType } from "@/app/api/type/organisation";
import { SelectOption } from "../common/fields/FormSelectField";
import { CreateUserFormValues, TeamOption } from "./util";

export type CreateUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: TeamOption[];
  tiers: SelectOption[];
  organisations: OrganisationListType[];
  defaultValues?: Partial<CreateUserFormValues>;
};

export type UsersListFilterState = {
  search: string;
  orgFilter: string;
  tierFilter: string;
  statusFilter: "all" | "active" | "inactive";
};
