import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const formatDate = (date: string, format = "DD/MM/YYYY") =>
  dayjs(date).format(format);

export const TIER_OPTIONS = [
  {
    value: "standard",
    label: "Standard",
  },
  {
    value: "super_admin",
    label: "Super Admin",
  },
];

export const getFinishingPositionSuffix = (position: number) => {
  if (position === 1) return "st";
  if (position === 2) return "nd";
  if (position === 3) return "rd";
  return "th";
};
