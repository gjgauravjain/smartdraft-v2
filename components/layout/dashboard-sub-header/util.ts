import { ProjectType } from "@/app/api/type/projects";

export const PAST_YEAR_THRESHOLD = new Date().getFullYear() - 1;

export const isPastSeason = (project: ProjectType): boolean => {
  const yr = parseInt(project.year, 10);
  return !isNaN(yr) && yr < PAST_YEAR_THRESHOLD;
};
