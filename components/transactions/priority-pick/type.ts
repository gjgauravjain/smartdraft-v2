import { PriorityPickImpact } from "@/app/api/type/priority-pick";

export type PriorityPickFormValues = {
  club: string;
  pickType: string;
  alignedPick: string;
  insert: string;
  overallPick: string;
  reason: string;
};

export type PriorityPickStatusView =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; impact: PriorityPickImpact }
  | { kind: "field"; messages: string[] }
  | { kind: "server"; message: string };
