import { ApplyCompensationPick } from "@/app/api/type/apply-compensation";

export type ApplyCompensationView =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "error"; messages: string[] }
  | {
      kind: "ready";
      picks: ApplyCompensationPick[];
      saveError: string[];
    };
