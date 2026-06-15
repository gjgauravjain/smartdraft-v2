'use client";'
import Organisations from "@/components/organisations/Organisations";
import { PrivateRoute } from "@/components/routes";

const OrganisationPage = () => {
  return (
    <PrivateRoute>
      <Organisations />
    </PrivateRoute>
  );
};

export default OrganisationPage;
