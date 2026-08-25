import {
  useCreateUser,
  useGetAllUsers,
  useUpdateUser,
} from "@/app/api/react-query/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUserModalProps, UsersListFilterState } from "./type";
import {
  createUserFormDefaults,
  createUserFormSchema,
  CreateUserFormValues,
  getLinkedOrganisations,
  normalizeOrgId,
  orgIdsMatch,
} from "./util";
import { UserListType } from "@/app/api/type/user";
import { filterUsers } from "./util";
import { useGetTeams } from "@/app/api/react-query/common";
import { useGetOrganisations } from "@/app/api/react-query/organisations";
import {
  editUserFormSchema,
  EditUserFormValues,
  getEditUserFormDefaults,
} from "./row-actions/editUserForm";
import { TierValue } from "./row-actions/types";
import { useAuth } from "@/store/useStore";
import { getErrorMessage } from "@/lib/api-client";

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
        organisationAdminIds: (defaultValues?.organisationAdminIds ?? []).map(
          normalizeOrgId,
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultValues]);

  const organisationIds = form.watch("organisationIds");
  const organisationAdminIds = form.watch("organisationAdminIds");

  const linkedOrgs = useMemo(
    () => getLinkedOrganisations(organisations, organisationIds),
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
    form.setValue(
      "organisationAdminIds",
      organisationAdminIds
        .map(normalizeOrgId)
        .filter((id) => !orgIdsMatch(id, normalizedId)),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const setOrganisationAdmin = (
    orgId: string | number,
    isOrgAdmin: boolean,
  ) => {
    const normalizedId = normalizeOrgId(orgId);
    const current = organisationAdminIds.map(normalizeOrgId);
    const hasAdmin = current.some((id) => orgIdsMatch(id, normalizedId));

    if (isOrgAdmin && !hasAdmin) {
      form.setValue("organisationAdminIds", [...current, normalizedId], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    if (!isOrgAdmin && hasAdmin) {
      form.setValue(
        "organisationAdminIds",
        current.filter((id) => !orgIdsMatch(id, normalizedId)),
        { shouldDirty: true, shouldValidate: true },
      );
    }
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
    organisationAdminIds,
    addOrganisation,
    removeOrganisation,
    setOrganisationAdmin,
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
    refetch,
    createUserOpen,
    setCreateUserOpen,
    teamOptions,
    organisations,
  };
};

export const useUserRowActions = (user: UserListType) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [tierOpen, setTierOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierValue>(
    user.isSuperuser ? "super_admin" : "standard",
  );

  const editForm = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: getEditUserFormDefaults(user),
  });

  const { user: currentUser } = useAuth();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { data: allUsers = [] } = useGetAllUsers();

  const isCurrentUser = currentUser?.id === user.id;
  const canManageUsers = Boolean(currentUser?.isSuperuser);
  const activeSuperAdminCount = allUsers.filter(
    (item) => item.isSuperuser && item.isActive,
  ).length;
  const wouldRemoveLastSuperAdmin =
    user.isSuperuser && user.isActive && activeSuperAdminCount <= 1;

  const handleUpdate = (
    updates: {
      firstName?: string;
      lastName?: string;
      defaultTeamId?: string;
      isSuperuser?: boolean;
      isActive?: boolean;
    },
    successMessage: string,
    options?: {
      closeEdit?: boolean;
      closeTier?: boolean;
    },
  ) => {
    const closeEdit = options?.closeEdit ?? true;
    const closeTier = options?.closeTier ?? true;

    updateUser(
      {
        id: user.id,
        firstName: updates.firstName,
        lastName: updates.lastName,
        defaultTeamId: updates.defaultTeamId ?? String(user.teamId),
        isSuperuser: updates.isSuperuser,
        isActive: updates.isActive,
      },
      {
        onSuccess: () => {
          toast.success(successMessage);
          setOpen(false);
          setDeactivateOpen(false);
          if (closeEdit) {
            setEditOpen(false);
          }
          if (closeTier) {
            setTierOpen(false);
          }
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Unable to update user."));
        },
      },
    );
  };

  const handleEditUser = () => {
    editForm.reset(getEditUserFormDefaults(user));
    setEditOpen(true);
  };

  const handleChangeTier = () => {
    setSelectedTier(user.isSuperuser ? "super_admin" : "standard");
    setTierOpen(true);
  };

  const handleSaveEdit = (values: EditUserFormValues) => {
    handleUpdate(
      {
        firstName: values.firstName.trim() || user.firstName,
        lastName: values.lastName.trim() || user.lastName,
        defaultTeamId: values.defaultTeamId,
        isActive: values.isActive,
      },
      "User updated successfully",
    );
  };

  const handleSaveTier = () => {
    const nextTier = selectedTier === "super_admin";

    if (nextTier === user.isSuperuser) {
      setTierOpen(false);
      return;
    }

    handleUpdate(
      { isSuperuser: nextTier },
      nextTier ? "User promoted successfully" : "User demoted successfully",
      { closeEdit: false },
    );
  };

  const handleDeactivateAccount = () => {
    setOpen(false);
    setDeactivateOpen(true);
  };

  const handleConfirmDeactivate = () => {
    handleUpdate({ isActive: false }, "User deactivated successfully");
  };

  const disableReason = () => {
    if (!canManageUsers) {
      return "You do not have permission to manage users";
    }
    if (isCurrentUser) {
      return "You cannot update your own account from this menu";
    }
    return undefined;
  };

  const changeTierReason = () => {
    if (!canManageUsers || isCurrentUser) {
      return disableReason();
    }
    if (wouldRemoveLastSuperAdmin) {
      return "You cannot demote the last active super admin";
    }
    return undefined;
  };

  const deactivateReason = () => {
    if (!canManageUsers || isCurrentUser) {
      return disableReason();
    }
    if (!user.isActive) {
      return "This account is already inactive";
    }
    if (wouldRemoveLastSuperAdmin) {
      return "You cannot deactivate the last active super admin";
    }
    return undefined;
  };

  return {
    open,
    setOpen,
    editOpen,
    setEditOpen,
    tierOpen,
    setTierOpen,
    deactivateOpen,
    setDeactivateOpen,
    selectedTier,
    setSelectedTier,
    editForm,
    isPending,
    isCurrentUser,
    canManageUsers,
    wouldRemoveLastSuperAdmin,
    handleEditUser,
    handleChangeTier,
    handleSaveEdit,
    handleSaveTier,
    handleDeactivateAccount,
    handleConfirmDeactivate,
    disableReason,
    changeTierReason,
    deactivateReason,
  };
};
