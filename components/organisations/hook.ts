import {
  useCreateOrganisation,
  useGetOrganisations,
} from "@/app/api/react-query/organisations";
import { OrganisationListType } from "@/app/api/type/organisation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newOrganisationSchema, NewOrganisationSchema } from "./util";
import { NewOrganisationModalProps } from "./type";
import { useState } from "react";
import { useGetTeams } from "@/app/api/react-query/common";
import { SelectOption } from "../common/fields/FormSelectField";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useOrganisations = () => {
  const { data, isLoading, error, refetch, isRefetching } =
    useGetOrganisations();
  const [openAddModal, setOpenAddModal] = useState(false);
  const router = useRouter();
  const handleManageUsers = () => console.log("Navigate to manage users");
  const handleNewOrganisation = () => {
    setOpenAddModal(true);
  };
  const handleRowClick = (org: OrganisationListType) => {
    router.push(`/organisations/${org.id}`);
  };
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
    setOpenAddModal,
    openAddModal,
  };
};

export function useNewOrganisationModalWizard({
  onOpenChange,
}: Pick<NewOrganisationModalProps, "onOpenChange" | "onSuccess">) {
  const { data } = useGetTeams();

  const { mutate: createOrganisation, isPending } = useCreateOrganisation();
  const form = useForm<NewOrganisationSchema>({
    resolver: yupResolver(newOrganisationSchema),
    defaultValues: {
      organisationName: "",
      sportingCode: "",
      defaultTeam: "",
    },
  });

  function handleCancel() {
    form.reset();
    onOpenChange(false);
  }

  function handleSubmit(values: NewOrganisationSchema) {
    createOrganisation(
      {
        defaultTeam: values.defaultTeam,
        name: values.organisationName,
        sportingCode: values.sportingCode,
      },
      {
        onSuccess: () => {
          toast.success("Organisation created successfully");
          form.reset();
          onOpenChange(false);
        },
      },
    );
  }

  const teamOptions: SelectOption[] = data
    ? data.map((team) => ({
        label: team.teamNames,
        value: team.id,
        icon: team.image || undefined,
      }))
    : [];
  return {
    form,
    handleCancel,
    handleSubmit: form.handleSubmit(handleSubmit),
    teamOptions,
    isSubmitting: isPending,
  };
}
