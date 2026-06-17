import {
  NewOrganisationFormValues,
  OrgDetailsType,
} from "@/app/api/type/organisation";

export interface NewOrganisationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: OrgDetailsType;
  onSuccess?: (values: NewOrganisationFormValues) => void;
}
