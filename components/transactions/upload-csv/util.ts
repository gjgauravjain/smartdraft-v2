import { SelectOption } from "@/components/common/fields/FormSelectField";
import { z } from "zod";
import { UploadCsvFormValues } from "./type";

export const UPLOAD_CSV_DEFAULT_VALUES: UploadCsvFormValues = {
  csv: "",
};

export const TITLE = "Save to draft CSV";
export const DESCRIPTION =
  "Append this committed transaction to a shared draft CSV. Skip if this was a what-if, not a real-world event.";

export const transformCsvFileOptions = (files: string[] | undefined): SelectOption[] => {
  if (!files?.length) return [];

  return files.map((file) => ({
    label: file,
    value: file,
  }));
};

export const uploadCsvFormSchema = z.object({
  csv: z.string().min(1, "Please select a CSV file"),
});
