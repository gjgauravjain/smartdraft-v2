import { useCreateUser, useGetAllUsers } from "@/app/api/react-query/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUserModalProps, UsersListFilterState } from "./type";
import {
  createUserFormDefaults,
  createUserFormSchema,
  CreateUserFormValues,
  getAvailableOrganisations,
  getLinkedOrganisations,
  normalizeOrgId,
  orgIdsMatch,
} from "./util";
import { UserListType } from "@/app/api/type/user";
import { filterUsers } from "./util";
import { useGetTeams } from "@/app/api/react-query/common";
import { useGetOrganisations } from "@/app/api/react-query/organisations";
import { useStore } from "@/store/useStore";

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
        organisationIds: (defaultValues?.organisationIds ?? []).map(
          normalizeOrgId,
        ),
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

export const useUsersList = () => {
  const { data: users, isLoading, error, refetch } = useGetAllUsers();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [filters, setFilters] = useState<UsersListFilterState>({
    search: "",
    orgFilter: "all",
    tierFilter: "all",
    statusFilter: "all",
  });

  const { data: teams = [] } = useGetTeams();
  const { data: organisations = [] } = useGetOrganisations();

  const filteredUsers = useMemo(
    () =>
      filterUsers(
        users ?? [],
        filters.search,
        filters.orgFilter,
        filters.tierFilter,
        filters.statusFilter,
      ),
    [users, filters],
  );

  const teamOptions = useMemo(
    () =>
      teams.map((team) => ({
        id: team.id,
        name: team.teamNames,
      })),
    [teams],
  );

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search }));

  const setOrgFilter = (orgFilter: string) =>
    setFilters((prev) => ({ ...prev, orgFilter }));

  const setTierFilter = (tierFilter: string) =>
    setFilters((prev) => ({ ...prev, tierFilter }));

  const setStatusFilter = (
    statusFilter: UsersListFilterState["statusFilter"],
  ) => setFilters((prev) => ({ ...prev, statusFilter }));

  const handleRowClick = (user: UserListType) => {
    console.log("Navigate to user", user.id);
  };

  const handleMenuClick = (e: React.MouseEvent, user: UserListType) => {
    e.stopPropagation();
    console.log("Menu for user", user.id);
  };

  return {
    users: filteredUsers,
    isLoading,
    error,
    filters,
    setSearch,
    setOrgFilter,
    setTierFilter,
    setStatusFilter,
    handleRowClick,
    handleMenuClick,
    refetch,
    createUserOpen,
    setCreateUserOpen,
    teamOptions,
    organisations,
  };
};
