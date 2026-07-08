import React from "react";
import { MobileHeader } from "../common/MobileHeader";
import { Plus } from "lucide-react";

type UserMobileHeaderProps = {
  onAddUser: () => void;
};
const UserMobileHeader = ({ onAddUser }: UserMobileHeaderProps) => {
  return (
    <MobileHeader
      title="Users"
      additionalActions={<Plus className="h-4 w-4" onClick={onAddUser} />}
    />
  );
};

export default UserMobileHeader;
