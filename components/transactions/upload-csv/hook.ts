import {
  useAppendCsvTransaction,
  useGetCsvFileList,
} from "@/app/api/react-query/csv-reader";
import { getErrorMessage } from "@/lib/api-client";
import { UploadCsvTransactionType } from "@/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { closeUploadCsvPrompt } from "./prompt";
import { UploadCsvFormValues } from "./type";
import {
  transformCsvFileOptions,
  UPLOAD_CSV_DEFAULT_VALUES,
  uploadCsvFormSchema,
} from "./util";

export const useUploadCsvModal = (
  uploadCsvTransactionType: UploadCsvTransactionType,
) => {
  const { data: files = [], isLoading: filesLoading } = useGetCsvFileList({
    enabled: true,
  });
  const appendCsv = useAppendCsvTransaction();

  const form = useForm<UploadCsvFormValues>({
    defaultValues: UPLOAD_CSV_DEFAULT_VALUES,
    resolver: zodResolver(uploadCsvFormSchema),
  });

  useEffect(() => {
    form.reset(UPLOAD_CSV_DEFAULT_VALUES);
  }, [uploadCsvTransactionType, form]);

  const fileOptions = useMemo(() => transformCsvFileOptions(files), [files]);

  const handleClose = () => {
    form.reset(UPLOAD_CSV_DEFAULT_VALUES);
    closeUploadCsvPrompt();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await appendCsv.mutateAsync({
        fileName: values.csv,
        transactionType: uploadCsvTransactionType.transactionType,
        payload: uploadCsvTransactionType.payload,
      });
      toast.success("Updated successfully");
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save CSV row"));
    }
  });

  return {
    form,
    fileOptions,
    filesLoading,
    isSubmitting: appendCsv.isPending,
    handleClose,
    handleSubmit,
  };
};
