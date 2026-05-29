import { ProjectType } from "../type/projects";

export const transformProjectsData = (data: any[]): ProjectType[] => {
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
    user: project.user,
  }));
};