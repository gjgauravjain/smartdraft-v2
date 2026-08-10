import { MobileHeader } from "@/components/common/MobileHeader";

type OrgAdminMobileHeaderProps = {
  orgName: string;
};

export const OrgAdminMobileHeader = ({ orgName }: OrgAdminMobileHeaderProps) => (
  <MobileHeader title="Org Admin" subtitle={orgName} />
);
