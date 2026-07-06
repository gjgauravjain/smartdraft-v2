import apiClient from "@/lib/api-client";
import {
  createProjectApi,
  deleteProjectApi,
  getDraftOption,
  getProjects,
} from "@/lib/api-constant";
import { transformCreateProjectPayload } from "@/app/api/util/projects";
import { CreateProjectPayload } from "@/app/api/util/projects";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  transformDraftOptions,
  transformProjectData,
  transformProjectsData,
} from "../util/projects";

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

export const useGetDraftOptions = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["projects", "draft-options"],
    queryFn: async () => {
      const { data } = await apiClient.get(getDraftOption());
      return transformDraftOptions(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

const invalidateProjects = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["projects"] });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const { data } = await apiClient.post(
        createProjectApi(),
        transformCreateProjectPayload(payload),
      );
      return transformProjectData(data);
    },
    onSuccess: () => invalidateProjects(queryClient),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await apiClient.delete(deleteProjectApi(projectId));
      return data;
    },
    onSuccess: () => invalidateProjects(queryClient),
  });
};
