import {
  useCreateOrganisation,
  useGetOrganisations,
  useUpdateOrganisation,
} from "@/app/api/react-query/organisations";
import { OrganisationListType } from "@/app/api/type/organisation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newOrganisationSchema, NewOrganisationSchema } from "./util";
import { NewOrganisationModalProps } from "./type";
import { useEffect, useState } from "react";
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

export function useAddUpdateOrganisationModalWizard({
  onOpenChange,
  initialValue,
}: NewOrganisationModalProps) {
  const { data } = useGetTeams();
  const isEditing = !!initialValue;

  const { mutate: createOrganisation, isPending } = useCreateOrganisation();
  const { mutate: updateOrganisation, isPending: isUpdating } =
    useUpdateOrganisation();

  const form = useForm<NewOrganisationSchema>({
    resolver: yupResolver(newOrganisationSchema),
    defaultValues: {
      organisationName: "",
      sportingCode: "",
      defaultTeam: "",
    },
  });

  useEffect(() => {
    if (initialValue) {
      form.reset({
        organisationName: initialValue.name,
        sportingCode: initialValue.sportingCode.code,
        defaultTeam: initialValue.defaultTeam.id.toString(),
      });
      return;
    }
  }, [initialValue]);

  function handleCancel() {
    form.reset();
    onOpenChange(false);
  }

  function handleSubmit(values: NewOrganisationSchema) {
    if (isEditing) {
      updateOrganisation(
        {
          id: initialValue.id,
          defaultTeam: values.defaultTeam,
          name: values.organisationName,
          sportingCode: values.sportingCode,
        },
        {
          onSuccess: () => {
            toast.success("Organisation updated successfully");
            form.reset();
            onOpenChange(false);
          },
        },
      );
      return;
    }
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
    isEditing,
    handleCancel,
    handleSubmit: form.handleSubmit(handleSubmit),
    teamOptions,
    isSubmitting: isPending || isUpdating,
  };
}
