import { PlayerDatabaseType } from "@/app/api/type/player";
import { DISPLAY_STATES } from "./util";

export type BoardCategory = "all" | "fs" | "academy" | "nga";

export type BoardPlayer = PlayerDatabaseType & {
  rank: number;
};

export type DisplayStateKey = (typeof DISPLAY_STATES)[number]["key"];
