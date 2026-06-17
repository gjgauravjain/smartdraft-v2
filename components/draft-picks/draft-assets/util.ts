import { TeamType } from "@/app/api/type/common";
import { DraftAssetGraphType, DraftAssetType } from "@/app/api/type/draftpicks";

export const YEAR_COLOR_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function defaultMatchTeam(ownerName: string, team: TeamType) {
  return (
    team.teamNames?.toLowerCase() === ownerName?.toLowerCase() ||
    team.shortName?.toLowerCase() === ownerName?.toLowerCase()
  );
}

export function totalFor(row: DraftAssetGraphType, years: string[]) {
  return years.reduce((sum, y) => {
    const v = row[y];
    return sum + (typeof v === "number" ? v : 0);
  }, 0);
}

export function formatPoints(n: number) {
  return n.toLocaleString("en-AU");
}

export const transformDraftAssetGraphData = (
  list: DraftAssetType[],
): DraftAssetGraphType[] => {
  const result: DraftAssetGraphType[] = [];
  const groupedData: any = new Map<string, DraftAssetType>();
  list.forEach((data) => {
    const key = data.ownerName;
    if (!groupedData.has(key)) {
      groupedData.set(key, { name: data.ownerName });
    }
    groupedData.get(key)![data.year] = data.aflPoints;
  });
  groupedData.forEach((data: any) => {
    result.push(data);
  });
  return result;
};
