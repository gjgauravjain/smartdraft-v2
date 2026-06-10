import { NewOrganisationFormValues } from "@/app/api/type/organisation";

export interface NewOrganisationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (values: NewOrganisationFormValues) => void;
}
