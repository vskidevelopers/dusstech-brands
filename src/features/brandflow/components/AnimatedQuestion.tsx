'use client';

import { AnimatePresence } from 'framer-motion';
import { QuestionCard } from './QuestionCard';
import type { FlowStep, FlowOption } from '../types';

interface AnimatedQuestionProps {
    step: FlowStep;
    onSelect: (option: FlowOption) => void;
}

export function AnimatedQuestion({ step, onSelect }: AnimatedQuestionProps) {
    return (
        <AnimatePresence mode="wait">
            <QuestionCard key={step.id} step={step} onSelect={onSelect} />
        </AnimatePresence>
    );
}