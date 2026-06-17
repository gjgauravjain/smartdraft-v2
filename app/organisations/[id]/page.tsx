import OrganisationDetails from "@/components/organisations/org-details/OrganisationDetails";
import { PrivateRoute } from "@/components/routes";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganisationDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <PrivateRoute>
      <OrganisationDetails id={id} />
    </PrivateRoute>
  );
}
