import { useGetOrganisations } from "@/app/api/react-query/organisations";
import { OrganisationListType } from "@/app/api/type/organisation";

export const useOrganisations = () => {
  const { data, isLoading, error, refetch, isRefetching } =
    useGetOrganisations();

  const handleManageUsers = () => console.log("Navigate to manage users");
  const handleNewOrganisation = () => console.log("Open new organisation");
  const handleRowClick = (org: OrganisationListType) =>
    console.log("Navigate to org", org.id);
  const handleMenuClick = (_e: React.MouseEvent, org: OrganisationListType) =>
    console.log("Menu for org", org.id);

  return {
    organisations: data ?? [],
    loading: isLoading || isRefetching,
    error: error?.message ?? null,
    handleManageUsers,
    handleNewOrganisation,
    handleRowClick,
    handleMenuClick,
    refetch,
  };
};
