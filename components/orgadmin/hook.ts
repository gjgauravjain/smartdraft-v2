"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetOrgMembers,
  useRemoveOrgMember,
  useUpdateOrgMemberRoles,
} from "@/app/api/react-query/org-admin";
import { useGetTeams } from "@/app/api/react-query/common";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { routeUrl } from "@/lib/route-url";
import {
  getOrganisationTitle,
  isOrgAdminForOrg,
  resolveOrganisationId,
} from "@/lib/org-admin";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import {
  defaultOrgAdminFilters,
  filterOrgMembers,
  getMemberState,
  getUpdatedRoles,
  isOrgAdminMember,
  OrgAdminFilterState,
} from "./util";

export const useOrgAdmin = () => {
  const router = useRouter();
  const { user, currentOrganisation } = useStore();
  const organisations = user?.organisations ?? [];
  const orgId = resolveOrganisationId(currentOrganisation, organisations);
  const orgName = getOrganisationTitle(organisations, orgId);
  const isOrgAdmin = isOrgAdminForOrg(user, orgId);

  const [filters, setFilters] =
    useState<OrgAdminFilterState>(defaultOrgAdminFilters);

  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useGetOrgMembers(orgId, isOrgAdmin);
  const { data: teams = [] } = useGetTeams();
  const { mutate: updateRoles, isPending: isUpdatingRoles } =
    useUpdateOrgMemberRoles();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveOrgMember();

  useEffect(() => {
    if (user && orgId && !isOrgAdmin) {
      router.replace(routeUrl.home);
    }
  }, [user, orgId, isOrgAdmin, router]);

  const filteredMembers = useMemo(
    () => filterOrgMembers(members, filters),
    [members, filters],
  );

  const stats = useMemo(() => {
    const activeCount = members.filter(
      (member) => getMemberState(member) === "active",
    ).length;
    const pendingCount = members.filter(
      (member) => getMemberState(member) === "pending",
    ).length;
    const orgAdminCount = members.filter((member) =>
      isOrgAdminMember(member),
    ).length;

    return {
      totalMembers: members.length,
      activeCount,
      pendingCount,
      orgAdminCount,
    };
  }, [members]);

  const handleRoleChange = (member: OrgMemberType, makeAdmin: boolean) => {
    updateRoles(
      {
        orgId,
        userId: member.userId,
        roles: getUpdatedRoles(member.roles, makeAdmin),
      },
      {
        onSuccess: () => {
          toast.success(
            makeAdmin ? "Org admin access granted" : "Org admin access revoked",
          );
        },
        onError: () => {
          toast.error("Unable to update member role");
        },
      },
    );
  };

  const handleRemove = (member: OrgMemberType) => {
    removeMember(
      { orgId, userId: member.userId },
      {
        onSuccess: () => {
          toast.success("Member removed from organisation");
        },
        onError: () => {
          toast.error("Unable to remove member");
        },
      },
    );
  };

  return {
    orgName,
    members: filteredMembers,
    allMembers: members,
    teams,
    filters,
    stats,
    isLoading,
    error,
    isOrgAdmin,
    isUpdating: isUpdatingRoles || isRemovingMember,
    currentUserId: user?.id,
    refetch,
    setSearch: (search: string) =>
      setFilters((prev) => ({ ...prev, search })),
    setRoleFilter: (roleFilter: OrgAdminFilterState["roleFilter"]) =>
      setFilters((prev) => ({ ...prev, roleFilter })),
    setStateFilter: (stateFilter: OrgAdminFilterState["stateFilter"]) =>
      setFilters((prev) => ({ ...prev, stateFilter })),
    handleMakeAdmin: (member: OrgMemberType) =>
      handleRoleChange(member, true),
    handleRevokeAdmin: (member: OrgMemberType) =>
      handleRoleChange(member, false),
    handleRemove,
  };
};
