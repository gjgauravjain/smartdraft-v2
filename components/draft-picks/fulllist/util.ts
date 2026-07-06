import { DataFullOrderListType } from "@/app/api/type/draftpicks";

export const hasValue = (v?: string) =>
  !!v && v !== "—" && v?.toString()?.trim() !== "";

export const isAdjusted = (item: DataFullOrderListType) =>
  hasValue(item.reason);

export const buildTradeTooltip = (item: DataFullOrderListType) => {
  const parts: string[] = [];
  if (hasValue(item.originalOwner))
    parts.push(`Traded · from ${item.originalOwner}`);
  if (hasValue(item.previousOwner))
    parts.push(`Traded · then to ${item.previousOwner}`);
  if (parts.length === 0 && item.reason) parts.push(item.reason);
  return parts.join("\n");
};
