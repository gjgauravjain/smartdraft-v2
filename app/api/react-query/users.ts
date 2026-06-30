import apiClient from "@/lib/api-client";
import { getAllUsersApiUrl } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { transformAllUsers } from "../util/user";

export const useGetAllUsers = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      const { data } = await apiClient.get(getAllUsersApiUrl());
      return transformAllUsers(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
