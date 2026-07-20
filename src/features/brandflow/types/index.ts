import type { LucideIcon } from "lucide-react";

/**
 * A single selectable option within a question step.
 * `next` can be a step ID (static branch) or a function (dynamic branch).
 */
export interface FlowOption {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  image?: string;
  /** Static next step ID, OR a function that evaluates answers to return a step ID */
  next: string | ((answers: Record<string, string>) => string);
  /** Tags attached to this selection, used for recommendation matching */
  tags?: string[];
}

/**
 * A recommendation item surfaced on the result screen.
 */
export interface Recommendation {
  id: string;
  type: "service" | "product" | "collection" | "portfolio";
  title: string;
  description: string;
  href: string;
  image?: string;
  icon?: LucideIcon;
  /** Tags used to match against user answers */
  matchTags: string[];
  /** Higher = shown first */
  priority?: number;
}

/**
 * A single step in the flow.
 */
export interface FlowStep {
  id: string;
  type: "question" | "result";
  title: string;
  description?: string;
  question?: string;
  options?: FlowOption[];
  /** For result steps: which recommendation types to surface */
  recommendationTypes?: Recommendation["type"][];
  /** Layout variant for question steps */
  layout?: "grid" | "list" | "hero";
  /** Icon for the step header */
  icon?: LucideIcon;
}

/**
 * A complete flow definition.
 * Admin-editable in the future without touching React code.
 */
export interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  entryStepId: string;
  steps: Record<string, FlowStep>;
  recommendations: Recommendation[];
}

/**
 * The serializable state stored in Zustand.
 */
export interface BrandFlowState {
  flowId: string | null;
  currentStepId: string | null;
  answers: Record<string, string>;
  /** All tags accumulated from selected options */
  accumulatedTags: string[];
  /** History for back navigation (stack of step IDs) */
  history: string[];
  isComplete: boolean;
  startedAt: number | null;
  completedAt: number | null;
}

/**
 * Actions exposed by the store.
 */
export interface BrandFlowActions {
  startFlow: (flowId: string, entryStepId: string) => void;
  selectOption: (
    stepId: string,
    option: FlowOption,
    nextStepId: string,
  ) => void;
  goBack: () => void;
  restart: () => void;
  complete: () => void;
  reset: () => void;
}

export type BrandFlowStore = BrandFlowState & BrandFlowActions;
