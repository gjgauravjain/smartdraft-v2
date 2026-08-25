import { z } from "zod";
import { UserListType } from "@/app/api/type/user";

export const editUserFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  defaultTeamId: z.string().min(1, "Default team is required"),
  isActive: z.boolean(),
});

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export const getEditUserFormDefaults = (
  user: UserListType,
): EditUserFormValues => ({
  firstName: user.firstName,
  lastName: user.lastName,
  defaultTeamId: String(user.teamId),
  isActive: user.isActive,
});
