import { useCreateUser } from "@/app/api/react-query/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUserModalProps } from "./type";
import {
  createUserFormDefaults,
  createUserFormSchema,
  CreateUserFormValues,
  getAvailableOrganisations,
  getLinkedOrganisations,
  orgIdsMatch,
} from "./util";

type UseCreateUserModalArgs = Pick<
  CreateUserModalProps,
  "open" | "onOpenChange" | "organisations" | "defaultValues"
>;

export function useCreateUserModal({
  open,
  onOpenChange,
  organisations,
  defaultValues,
}: UseCreateUserModalArgs) {
  const { mutate: createUser, isPending: isSubmitting } = useCreateUser();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: createUserFormDefaults,
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...createUserFormDefaults, ...defaultValues });
    }
  }, [open, defaultValues, form]);

  const organisationIds = form.watch("organisationIds");

  const linkedOrgs = useMemo(
    () => getLinkedOrganisations(organisations, organisationIds),
    [organisations, organisationIds],
  );

  const availableOrgsToAdd = useMemo(
    () => getAvailableOrganisations(organisations, organisationIds),
    [organisations, organisationIds],
  );

  const addOrganisation = (orgId: string) => {
    form.setValue("organisationIds", [...organisationIds, orgId], {
      shouldDirty: true,
    });
  };

  const removeOrganisation = (orgId: string) => {
    form.setValue(
      "organisationIds",
      organisationIds.filter((id) => !orgIdsMatch(id, orgId)),
      { shouldDirty: true },
    );
  };

  const handleSubmit = form.handleSubmit((values) => {
    createUser(values, {
      onSuccess: () => {
        toast.success("User created successfully");
        onOpenChange(false);
      },
    });
  });

  return {
    form,
    isSubmitting,
    linkedOrgs,
    availableOrgsToAdd,
    addOrganisation,
    removeOrganisation,
    handleSubmit,
  };
}
