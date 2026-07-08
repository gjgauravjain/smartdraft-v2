import { PrivateRoute } from "@/components/routes";
import UsersList from "@/components/users/UsersList";
import React from "react";

const UsersPage = () => {
  return (
    <PrivateRoute>
      <UsersList />
    </PrivateRoute>
  );
};

export default UsersPage;
