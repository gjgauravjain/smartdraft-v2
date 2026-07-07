import { ProjectType, DraftOptionType } from "../type/projects";

export type CreateProjectPayload = {
  projectName: string;
  projectDescription: string;
  draftType: string;
  team: string;
  draftYear: string;
};

export const transformDraftOptions = (data: unknown): DraftOptionType[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    value: item.draft_type,
    label: item.display_name,
    year: String(item.year),
  }));
};

export const transformCreateProjectPayload = ({
  projectName,
  projectDescription,
  draftType,
  team,
  draftYear,
}: CreateProjectPayload) => ({
  project_name: projectName,
  project_desc: projectDescription,
  teamid: team,
  year: draftYear,
  draft_type: draftType,
  bid_discounts: "",
  bidding_discount_type: "RULE_1",
  draft_value_index: "",
  draft_value_index_type: draftYear === "2025" ? "RULE_2" : "RULE_1",
});

export const transformProjectData = (project: any): ProjectType => ({
  id: project.id.toString(),
  projectName: project.project_name,
  projectDesc: project.project_desc,
  teamId: project.team_id?.toString?.() ?? project.teamid?.toString?.() ?? "",
  file: project.file ?? null,
  year: String(project.year ?? ""),
  draftType: project.draft_type,
  draftValueIndexType: project.draft_value_index_type ?? "",
  biddingDiscountType: project.bidding_discount_type ?? "",
  draftLadder: project.draft_ladder ?? {},
  user: project.user ?? 0,
});

export const transformProjectsData = (data: any[]): ProjectType[] => {
  if (!data) {
    return [];
  }
  return data.map(transformProjectData);
};