"use client";

import {
  useGetOrgDetails,
  useGetOrgMembers,
} from "@/app/api/react-query/organisations";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";
import { AddUpdateOrganisationModal } from "../AddUpdateOrganisationModal";
import { useState } from "react";
import { OrgMembersList } from "./OrgMembers";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";

export default function OrganisationDetails({ id }: { id: string }) {
  const { data } = useGetOrgDetails(id);
  const { data: memberList } = useGetOrgMembers(id);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <div className="h-full bg-background">
      <OrganisationHeader
        title={data?.name ?? "Organisation"}
        onBack={() => history.back()}
        onEdit={() => setOpenEditModal(true)}
        onDeactivate={() => setDeactivateOpen(true)}
      />
      <div className="p-5">
        {data && <OrgInfoCard organisation={data} />}
        <div className="mt-4">
          <OrgMembersList membersList={memberList || []} />
        </div>
      </div>
      <AddUpdateOrganisationModal
        onOpenChange={() => {
          setOpenEditModal((prev) => !prev);
        }}
        open={openEditModal}
        initialValue={data}
      />
      <ConfirmDangerDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate organisation"
        subtitle={`${data?.name} · ${data?.members} members`}
        description="This removes the organisation from the platform and revokes all member access."
        confirmText={data?.name.toUpperCase()}
        actionLabel="Deactivate org"
        onConfirm={() => {
          console.log("Deactivate");
        }}
      />
    </div>
  );
}
