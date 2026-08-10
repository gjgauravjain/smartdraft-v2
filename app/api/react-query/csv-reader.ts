import {
  csvUploadReaderApiUrl,
  getcsvListFiles,
} from "@/lib/api-constant";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCsvFileList = ({ enabled = true }: { enabled?: boolean }) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["csv-file-list"],
    queryFn: async () => {
      const { data } = await apiClient.get<string[]>(getcsvListFiles());
      return Array.isArray(data) ? data : [];
    },
    enabled: !!accessToken && enabled,
    staleTime: 0,
    retry: 0,
  });
};

export const useAppendCsvTransaction = () => {
  return useMutation({
    mutationFn: async ({
      fileName,
      transactionType,
      payload,
    }: {
      fileName: string;
      transactionType: string;
      payload: Record<string, unknown> | unknown[];
    }) => {
      const { data } = await apiClient.post(
        csvUploadReaderApiUrl(fileName),
        {
          transaction_type: transactionType,
          payload,
        },
      );
      return data;
    },
  });
};
