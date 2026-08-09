import { PrivateRoute } from "@/components/routes";
import OrgAdmin from "@/components/orgadmin/OrgAdmin";
import React from "react";

const OrgAdminPage = () => {
  return (
    <PrivateRoute>
      <OrgAdmin />
    </PrivateRoute>
  );
};

export default OrgAdminPage;
