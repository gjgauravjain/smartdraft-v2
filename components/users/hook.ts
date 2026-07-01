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
  normalizeOrgId,
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
      form.reset({
        ...createUserFormDefaults,
        ...defaultValues,
        organisationIds: (defaultValues?.organisationIds ?? []).map(normalizeOrgId),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  const organisationIds = form.watch("organisationIds");

  const linkedOrgs = useMemo(
    () => getLinkedOrganisations(organisations, organisationIds),
    [organisations, organisationIds],
  );

  const availableOrgsToAdd = useMemo(
    () => getAvailableOrganisations(organisations, organisationIds),
    [organisations, organisationIds],
  );

  const addOrganisation = (orgId: string | number) => {
    const normalizedId = normalizeOrgId(orgId);

    if (organisationIds.some((id) => orgIdsMatch(id, normalizedId))) {
      return;
    }

    form.setValue(
      "organisationIds",
      [...organisationIds.map(normalizeOrgId), normalizedId],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const removeOrganisation = (orgId: string | number) => {
    const normalizedId = normalizeOrgId(orgId);

    form.setValue(
      "organisationIds",
      organisationIds
        .map(normalizeOrgId)
        .filter((id) => !orgIdsMatch(id, normalizedId)),
      { shouldDirty: true, shouldValidate: true },
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
