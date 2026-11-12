import { FreeAgentCompensationFormInput } from "@/app/api/type/free-agent-compensation";
import { FreeAgentCompensationImpact } from "@/app/api/type/free-agent-compensation";

export type FreeAgentCompensationFormValues = FreeAgentCompensationFormInput & {
  playerQuery: string;
};

export type FreeAgentCompensationStatusView =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; impact: FreeAgentCompensationImpact }
  | { kind: "field"; messages: string[] }
  | { kind: "server"; message: string };
