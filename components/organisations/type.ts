import {
  NewOrganisationFormValues,
  OrganisationListType,
} from "@/app/api/type/organisation";

export interface NewOrganisationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: OrganisationListType;
  onSuccess?: (values: NewOrganisationFormValues) => void;
}
