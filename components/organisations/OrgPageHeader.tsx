import { PlusIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";

type OrgPageHeaderProps = {
  onManageUsers: () => void;
  onNewOrganisation: () => void;
};

export const OrgPageHeader = ({
  onManageUsers,
  onNewOrganisation,
}: OrgPageHeaderProps) => (
  <div className="bg-card border-b border-border px-5 py-3 flex items-center gap-3 shrink-0">
    <div className="min-w-0">
      <h1 className="text-[17px] font-bold text-foreground tracking-[-0.2px]">
        Organisations
      </h1>
      <p className="text-[11.5px] text-muted-foreground mt-px">
        SmartDraft platform · all organisations
      </p>
    </div>
    <span className="flex-1" />

    <Button onClick={onManageUsers} variant="outline">
      <UserIcon size={13} />
      Manage users
    </Button>

    <Button onClick={onNewOrganisation}>
      <PlusIcon size={13} />
      New organisation
    </Button>
  </div>
);
