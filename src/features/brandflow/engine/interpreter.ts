import type { FlowDefinition, FlowOption, FlowStep } from "../types";

/**
 * Resolves the next step ID for a given option.
 * Handles both static (string) and dynamic (function) branches.
 */
export function resolveNextStep(
  option: FlowOption,
  answers: Record<string, string>,
): string {
  if (typeof option.next === "function") {
    return option.next(answers);
  }
  return option.next;
}

/**
 * Gets a step from a flow definition, with safety check.
 */
export function getStep(flow: FlowDefinition, stepId: string): FlowStep | null {
  return flow.steps[stepId] ?? null;
}

/**
 * Computes the progress percentage through the flow.
 * Based on history length vs. estimated total steps.
 */
export function computeProgress(
  historyLength: number,
  totalEstimate: number = 5,
): number {
  // We don't know exact path due to branching, so estimate.
  const progress = Math.min(
    100,
    Math.round((historyLength / totalEstimate) * 100),
  );
  return progress;
}

/**
 * Filters recommendations by matching tags from user answers.
 * Returns sorted by priority (desc), then by match count (desc).
 */
export function matchRecommendations(
  flow: FlowDefinition,
  accumulatedTags: string[],
  types?: Array<"service" | "product" | "collection" | "portfolio">,
) {
  const tagSet = new Set(accumulatedTags);

  const scored = flow.recommendations
    .filter((rec) => !types || types.includes(rec.type))
    .map((rec) => {
      const matchCount = rec.matchTags.filter((t) => tagSet.has(t)).length;
      return { rec, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => {
      // Primary: match count
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      // Secondary: priority
      return (b.rec.priority ?? 0) - (a.rec.priority ?? 0);
    });

  return scored.map(({ rec }) => rec);
}

/**
 * Builds a human-readable summary of the user's journey.
 */
export function buildJourneySummary(
  flow: FlowDefinition,
  answers: Record<string, string>,
): Array<{ stepTitle: string; answerLabel: string }> {
  const summary: Array<{ stepTitle: string; answerLabel: string }> = [];

  for (const [stepId, optionId] of Object.entries(answers)) {
    const step = flow.steps[stepId];
    if (!step?.options) continue;
    const option = step.options.find((o) => o.id === optionId);
    if (option) {
      summary.push({
        stepTitle: step.question || step.title,
        answerLabel: option.label,
      });
    }
  }

  return summary;
}
