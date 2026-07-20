"use client";

import { useMemo, useCallback } from "react";
import { useBrandFlowStore } from "../store/useBrandFlowStore";
import { getFlow } from "../data";
import {
  getStep,
  resolveNextStep,
  computeProgress,
  matchRecommendations,
  buildJourneySummary,
} from "../engine";
import type { FlowOption, FlowStep } from "../types";

export function useBrandFlow(flowId: string = "discovery") {
  const flow = useMemo(() => getFlow(flowId), [flowId]);

  const store = useBrandFlowStore();
  const {
    currentStepId,
    answers,
    accumulatedTags,
    history,
    isComplete,
    startFlow,
    selectOption,
    goBack,
    restart,
    reset,
    complete,
  } = store;

  const currentStep: FlowStep | null = useMemo(() => {
    if (!flow || !currentStepId) return null;
    return getStep(flow, currentStepId);
  }, [flow, currentStepId]);

  const progress = useMemo(() => {
    return computeProgress(history.length);
  }, [history.length]);

  const canGoBack = history.length > 1;

  const recommendations = useMemo(() => {
    if (!flow || !isComplete) return [];
    const types = currentStep?.recommendationTypes;
    return matchRecommendations(flow, accumulatedTags, types);
  }, [flow, accumulatedTags, isComplete, currentStep]);

  const journeySummary = useMemo(() => {
    if (!flow) return [];
    return buildJourneySummary(flow, answers);
  }, [flow, answers]);

  const handleStart = useCallback(() => {
    if (!flow) return;
    startFlow(flow.id, flow.entryStepId);
  }, [flow, startFlow]);

  const handleSelectOption = useCallback(
    (option: FlowOption) => {
      if (!currentStep) return;
      const nextStepId = resolveNextStep(option, answers);
      selectOption(currentStep.id, option, nextStepId);

      // Auto-complete if we've reached the result step
      const nextStep = flow ? getStep(flow, nextStepId) : null;
      if (nextStep?.type === "result") {
        complete();
      }
    },
    [currentStep, answers, selectOption, flow, complete],
  );

  const handleRestart = useCallback(() => {
    reset();
    if (flow) {
      startFlow(flow.id, flow.entryStepId);
    }
  }, [flow, reset, startFlow]);

  return {
    flow,
    currentStep,
    progress,
    canGoBack,
    isComplete,
    recommendations,
    journeySummary,
    answers,
    history,

    // Actions
    start: handleStart,
    selectOption: handleSelectOption,
    goBack,
    restart: handleRestart,
    reset,
  };
}
