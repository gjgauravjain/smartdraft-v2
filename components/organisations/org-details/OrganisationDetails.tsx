"use client";

import {
  useDeleteOrganisation,
  useGetOrganisations,
} from "@/app/api/react-query/organisations";
import {
  useGetOrgMembers,
  useRemoveOrgMember,
  useUpdateOrgMemberRoles,
} from "@/app/api/react-query/org-admin";
import { useGetTeams } from "@/app/api/react-query/common";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";
import { AddUpdateOrganisationModal } from "../AddUpdateOrganisationModal";
import { useMemo, useState } from "react";
import { OrgMembersList } from "./OrgMembers";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import type { CreateUserFormValues } from "@/components/users/util";
import {
  getUpdatedRoles,
} from "@/components/orgadmin/util";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TIER_OPTIONS } from "@/lib/utils";

export default function OrganisationDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useStore();
  const { data: organisations = [] } = useGetOrganisations();
  const { data: teams = [] } = useGetTeams();
  const { data: members = [] } = useGetOrgMembers(id);
  const { mutate: deleteOrganisation, isPending: isDeleting } =
    useDeleteOrganisation();
  const { mutate: updateRoles, isPending: isUpdatingRoles } =
    useUpdateOrgMemberRoles();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveOrgMember();

  const organisation = organisations.find(
    (org) => org.id.toString() === id.toString(),
  );

  const teamOptions = useMemo(
    () =>
      teams.map((team) => ({
        id: team.id,
        name: team.teamNames,
      })),
    [teams],
  );

  const createUserDefaults = useMemo((): Partial<CreateUserFormValues> => {
    if (!organisation) {
      return { organisationIds: [id.toString()] };
    }

    return {
      organisationIds: [organisation.id.toString()],
      defaultTeamId: organisation.defaultTeam.id.toString(),
    };
  }, [id, organisation]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const handleRoleChange = (member: OrgMemberType, makeAdmin: boolean) => {
    updateRoles(
      {
        orgId: id,
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

  const handleRemoveMember = (member: OrgMemberType) => {
    removeMember(
      { orgId: id, userId: member.userId },
      {
        onSuccess: () => {
          toast.success("User removed from organisation");
        },
        onError: () => {
          toast.error("Unable to remove member");
        },
      },
    );
  };

  return (
    <div className="h-full bg-background">
      <OrganisationHeader
        title={organisation?.name ?? "Organisation"}
        onBack={() => history.back()}
        onEdit={() => setOpenEditModal(true)}
        onDeactivate={() => setDeactivateOpen(true)}
      />
      <div className="p-5">
        {organisation && (
          <OrgInfoCard
            memberCount={members.length}
            organisation={organisation}
          />
        )}
        <div className="mt-4">
          <OrgMembersList
            membersList={members}
            orgName={organisation?.name ?? "Organisation"}
            currentUserId={user?.id}
            isUpdating={isUpdatingRoles || isRemovingMember}
            onAddUser={() => setCreateUserOpen(true)}
            onMakeAdmin={(member) => handleRoleChange(member, true)}
            onRevokeAdmin={(member) => handleRoleChange(member, false)}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </div>
      <AddUpdateOrganisationModal
        onOpenChange={() => {
          setOpenEditModal((prev) => !prev);
        }}
        open={openEditModal}
        initialValue={organisation}
      />
      <CreateUserModal
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        teams={teamOptions}
        tiers={TIER_OPTIONS}
        organisations={organisations}
        defaultValues={createUserDefaults}
      />
      <ConfirmDangerDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate organisation"
        subtitle={`${organisation?.name} · ${members.length} members`}
        description="This removes the organisation from the platform and revokes all member access."
        confirmText={organisation?.name.toUpperCase() ?? ""}
        actionLabel="Deactivate org"
        isLoading={isDeleting}
        onConfirm={() => {
          deleteOrganisation(id, {
            onSuccess: () => {
              toast.success("Organisation deactivated successfully");
              setDeactivateOpen(false);
              router.push("/organisations");
            },
          });
        }}
      />
    </div>
  );
}
