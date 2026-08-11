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
import { useLinkUserToOrganisation } from "@/app/api/react-query/users";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";
import { AddUpdateOrganisationModal } from "../AddUpdateOrganisationModal";
import { useMemo, useState } from "react";
import { OrgMembersList } from "./OrgMembers";
import { AddExistingUserDialog } from "./AddExistingUserDialog";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";
import { getUpdatedRoles } from "@/components/orgadmin/util";
import { ORGANISATION_ADMIN_ROLE } from "@/lib/org-admin";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrganisationDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useStore();
  const { data: organisations = [] } = useGetOrganisations();
  const { data: members = [] } = useGetOrgMembers(id);
  const { mutate: deleteOrganisation, isPending: isDeleting } =
    useDeleteOrganisation();
  const { mutate: updateRoles, isPending: isUpdatingRoles } =
    useUpdateOrgMemberRoles();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveOrgMember();
  const { mutate: linkUser, isPending: isLinkingUser } =
    useLinkUserToOrganisation();

  const organisation = organisations.find(
    (org) => org.id.toString() === id.toString(),
  );

  const existingMemberIds = useMemo(
    () => members.map((member) => member.userId),
    [members],
  );

  const [openEditModal, setOpenEditModal] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [addExistingOpen, setAddExistingOpen] = useState(false);

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

  const handleAddExistingUser = ({
    userId,
    isOrgAdmin,
  }: {
    userId: number;
    isOrgAdmin: boolean;
  }) => {
    linkUser(
      {
        orgId: id,
        userId,
        roles: isOrgAdmin ? [ORGANISATION_ADMIN_ROLE] : [],
      },
      {
        onSuccess: () => {
          toast.success("User added to organisation");
          setAddExistingOpen(false);
        },
        onError: () => {
          toast.error("Unable to add user to organisation");
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
            onAddUser={() => setAddExistingOpen(true)}
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
      <AddExistingUserDialog
        open={addExistingOpen}
        onOpenChange={setAddExistingOpen}
        orgId={id}
        orgName={organisation?.name ?? "Organisation"}
        existingMemberIds={existingMemberIds}
        isSubmitting={isLinkingUser}
        onAdd={handleAddExistingUser}
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
