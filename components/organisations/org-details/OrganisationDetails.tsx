"use client";

import {
  useDeleteOrganisation,
  useGetOrganisations,
} from "@/app/api/react-query/organisations";
import { useGetTeams } from "@/app/api/react-query/common";
import {
  useGetAllUsers,
  useUnlinkUserFromOrganisation,
} from "@/app/api/react-query/users";
import { getOrgMembersFromUsers } from "@/app/api/util/user";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";
import { AddUpdateOrganisationModal } from "../AddUpdateOrganisationModal";
import { useMemo, useState } from "react";
import { OrgMembersList } from "./OrgMembers";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import type { CreateUserFormValues } from "@/components/users/util";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TIER_OPTIONS } from "@/lib/utils";

export default function OrganisationDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: organisations = [] } = useGetOrganisations();
  const { data: teams = [] } = useGetTeams();
  const { data: users = [] } = useGetAllUsers();
  const { mutate: deleteOrganisation, isPending: isDeleting } =
    useDeleteOrganisation();
  const { mutate: unlinkUser, isPending: isUnlinkingUser } =
    useUnlinkUserFromOrganisation();

  const organisation = organisations.find(
    (org) => org.id.toString() === id.toString(),
  );

  const memberList = useMemo(
    () => getOrgMembersFromUsers(users, id),
    [users, id],
  );

  const organisationOptions = useMemo(
    () =>
      organisations.map((org) => ({
        id: org.id.toString(),
        name: org.name,
        shortCode: org.defaultTeam.shortName,
      })),
    [organisations],
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

  const handleRemoveMember = (userId: number) => {
    unlinkUser(
      { orgId: id, userId },
      {
        onSuccess: () => {
          toast.success("User removed from organisation");
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
            memberCount={memberList.length}
            organisation={organisation}
          />
        )}
        <div className="mt-4">
          <OrgMembersList
            membersList={memberList}
            onAddUser={() => setCreateUserOpen(true)}
            onRemoveMember={handleRemoveMember}
            isRemovingMember={isUnlinkingUser}
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
        subtitle={`${organisation?.name} · ${memberList.length} members`}
        description="This removes the organisation from the platform and revokes all member access."
        confirmText={organisation?.name.toUpperCase()}
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
