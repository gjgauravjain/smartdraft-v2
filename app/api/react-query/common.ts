import apiClient from "@/lib/api-client";
import { getFlagApiUrl, getUserInfo } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { transformTeamsData, transformUserDetails } from "../util/common";

const fetchTeams = async () => {
  const { data } = await apiClient.get(getFlagApiUrl);
  return transformTeamsData(data.data);
};

export const useGetTeams = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useGetUserDetails = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const { data } = await apiClient.get(getUserInfo());
      return transformUserDetails(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
