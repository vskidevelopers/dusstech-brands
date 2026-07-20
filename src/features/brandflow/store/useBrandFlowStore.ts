"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandFlowStore, FlowOption } from "../types";

const initialState = {
  flowId: null,
  currentStepId: null,
  answers: {},
  accumulatedTags: [],
  history: [],
  isComplete: false,
  startedAt: null,
  completedAt: null,
};

export const useBrandFlowStore = create<BrandFlowStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startFlow: (flowId, entryStepId) => {
        set({
          flowId,
          currentStepId: entryStepId,
          answers: {},
          accumulatedTags: [],
          history: [entryStepId],
          isComplete: false,
          startedAt: Date.now(),
          completedAt: null,
        });
      },

      selectOption: (stepId, option, nextStepId) => {
        const state = get();
        const newTags = [...state.accumulatedTags, ...(option.tags ?? [])];

        set({
          answers: { ...state.answers, [stepId]: option.id },
          accumulatedTags: Array.from(new Set(newTags)),
          currentStepId: nextStepId,
          history: [...state.history, nextStepId],
        });
      },

      goBack: () => {
        const state = get();
        if (state.history.length <= 1) return;

        const newHistory = state.history.slice(0, -1);
        const previousStepId = newHistory[newHistory.length - 1];
        const removedStepId = state.history[state.history.length - 1];

        // Remove the answer for the step we're leaving
        const newAnswers = { ...state.answers };
        const removedOptionId = newAnswers[removedStepId];

        // Remove tags from the removed option (best-effort)
        // Since we don't store per-step tags, we rebuild from remaining answers.
        // For simplicity, we keep accumulated tags as-is (they'll be recomputed on result).
        delete newAnswers[removedStepId];

        set({
          currentStepId: previousStepId,
          history: newHistory,
          answers: newAnswers,
          isComplete: false,
        });
      },

      restart: () => {
        const state = get();
        if (!state.flowId) return;
        // We don't know entryStepId here, so reset entirely.
        // The BrandFlow component will call startFlow again.
        set({ ...initialState });
      },

      complete: () => {
        set({ isComplete: true, completedAt: Date.now() });
      },

      reset: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "dusstech-brandflow",
      // Only persist progress, not the actions
      partialize: (state) => ({
        flowId: state.flowId,
        currentStepId: state.currentStepId,
        answers: state.answers,
        accumulatedTags: state.accumulatedTags,
        history: state.history,
        isComplete: state.isComplete,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
      }),
    },
  ),
);
