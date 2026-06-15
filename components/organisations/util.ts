import * as yup from "yup";

export const newOrganisationSchema = yup.object({
  organisationName: yup.string().required("Organisation name is required"),
  sportingCode: yup.string().required("Sporting code is required"),
  defaultTeam: yup.string().required("Default team is required"),
});

export type NewOrganisationSchema = yup.InferType<typeof newOrganisationSchema>;
