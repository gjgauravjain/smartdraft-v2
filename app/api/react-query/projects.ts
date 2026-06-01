import apiClient from "@/lib/api-client";
import { getProjects } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { transformProjectsData } from "../util/projects";

export const useGetProjects = () => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await apiClient.get(getProjects());
      return transformProjectsData(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
