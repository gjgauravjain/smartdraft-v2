"use client";

import { useGetOrgDetails } from "@/app/api/react-query/organisations";
import { OrganisationHeader } from "./OrgDetailHeader";
import { OrgInfoCard } from "./OrgInfo";

export default function OrganisationDetails({ id }: { id: string }) {
  const { data } = useGetOrgDetails(id);

  return (
    <div className="h-full bg-background">
      <OrganisationHeader
        title={data?.name ?? "Organisation"}
        onBack={() => history.back()}
        onEdit={() => console.log("edit")}
        onDeactivate={() => console.log("deactivate")}
      />
      <div className="p-5">{data && <OrgInfoCard organisation={data} />}</div>
    </div>
  );
}
