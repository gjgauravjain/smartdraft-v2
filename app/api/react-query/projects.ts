import apiClient from "@/lib/api-client";
import { getProjects } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";

export type ProjectType = {
    "id": string,
    "projectName": string,
    "projectDesc": string,
    "teamId": string,
    "file": string | null,
    "year": string,
    "draftType": string,
    "draftValueIndexType": "RULE_1",
    "biddingDiscountType": "RULE_1",
    "draftLadder": Record<string, number>,
    "user": number
}

const transformProjectsData = (data: any[]): ProjectType[] => {
    if (!data) {
        return [];
    }
    return data.map((project) => ({
        id: project.id.toString(),
        projectName: project.project_name,
        projectDesc: project.project_desc,
        teamId: project.team_id,
        file: project.file,
        year: project.year,
        draftType: project.draft_type,
        draftValueIndexType: project.draft_value_index_type,
        biddingDiscountType: project.bidding_discount_type,
        draftLadder: project.draft_ladder,
        user: project.user
    }));
}
export const useGetProjects = () => {
  const { accessToken } = useAuth();
  console.log("debug:Fetching projects with access token:", accessToken);
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await apiClient.get(getProjects());
      console.log("debug:Raw projects data:", data);
      return transformProjectsData(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};