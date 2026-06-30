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

export const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY");

export const TIER_OPTIONS = [
  {
    value: "standard",
    label: "Standard",
  },
];
