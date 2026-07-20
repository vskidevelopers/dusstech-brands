import { discoveryFlow } from "./flows/discovery";
import type { FlowDefinition } from "../types";

/**
 * Registry of all available flows.
 * Future: load from database.
 */
export const flowRegistry: Record<string, FlowDefinition> = {
  discovery: discoveryFlow,
};

export function getFlow(flowId: string): FlowDefinition | null {
  return flowRegistry[flowId] ?? null;
}

export { discoveryFlow };
