"use client";

import { useGetOrgDetails } from "@/app/api/react-query/organisations";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";
import { AddUpdateOrganisationModal } from "../AddUpdateOrganisationModal";
import { useState } from "react";

export default function OrganisationDetails({ id }: { id: string }) {
  const { data } = useGetOrgDetails(id);
  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <div className="h-full bg-background">
      <OrganisationHeader
        title={data?.name ?? "Organisation"}
        onBack={() => history.back()}
        onEdit={() => setOpenEditModal(true)}
        onDeactivate={() => console.log("deactivate")}
      />
      <div className="p-5">{data && <OrgInfoCard organisation={data} />}</div>
      <AddUpdateOrganisationModal
        onOpenChange={() => {
          setOpenEditModal((prev) => !prev);
        }}
        open={openEditModal}
        initialValue={data}
      />
    </div>
  );
}
