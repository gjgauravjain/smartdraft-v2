"use client";

import { useGetOrganisations } from "@/app/api/react-query/organisations";
import { useGetAllUsers } from "@/app/api/react-query/users";
import { getOrgMembersFromUsers } from "@/app/api/util/user";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";
import { AddUpdateOrganisationModal } from "../AddUpdateOrganisationModal";
import { useMemo, useState } from "react";
import { OrgMembersList } from "./OrgMembers";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";

export default function OrganisationDetails({ id }: { id: string }) {
  const { data: organisations } = useGetOrganisations();
  const { data: users = [] } = useGetAllUsers();
  const organisation = organisations?.find(
    (org) => org.id.toString() === id.toString(),
  );

  const memberList = useMemo(
    () => getOrgMembersFromUsers(users, id),
    [users, id],
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <div className="h-full bg-background">
      <OrganisationHeader
        title={organisation?.name ?? "Organisation"}
        onBack={() => history.back()}
        onEdit={() => setOpenEditModal(true)}
        onDeactivate={() => setDeactivateOpen(true)}
      />
      <div className="p-5">
        {organisation && <OrgInfoCard organisation={organisation} />}
        <div className="mt-4">
          <OrgMembersList membersList={memberList} />
        </div>
      </div>
      <AddUpdateOrganisationModal
        onOpenChange={() => {
          setOpenEditModal((prev) => !prev);
        }}
        open={openEditModal}
        initialValue={organisation}
      />
      <ConfirmDangerDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate organisation"
        subtitle={`${organisation?.name} · ${memberList.length} members`}
        description="This removes the organisation from the platform and revokes all member access."
        confirmText={organisation?.name.toUpperCase()}
        actionLabel="Deactivate org"
        onConfirm={() => {
          console.log("Deactivate");
        }}
      />
    </div>
  );
}
