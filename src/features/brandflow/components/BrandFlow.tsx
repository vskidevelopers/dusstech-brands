'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Container } from '@/components/website/ui';
import { ProgressIndicator } from './ProgressIndicator';
import { FlowNavigation } from './FlowNavigation';
import { FlowStepper } from './FlowStepper';
import { AnimatedQuestion } from './AnimatedQuestion';
import { ResultScreen } from './ResultScreen';
import { useBrandFlow } from '../hooks';

interface BrandFlowProps {
    flowId?: string;
}

export function BrandFlow({ flowId = 'discovery' }: BrandFlowProps) {
    const {
        flow,
        currentStep,
        progress,
        canGoBack,
        isComplete,
        recommendations,
        journeySummary,
        history,
        start,
        selectOption,
        goBack,
        restart,
    } = useBrandFlow(flowId);

    // Auto-start the flow if not already started
    useEffect(() => {
        if (flow && !currentStep) {
            start();
        }
    }, [flow, currentStep, start]);

    if (!flow || !currentStep) {
        return (
            <Container size="lg" className="py-20">
                <div className="text-center text-muted-foreground">Loading flow...</div>
            </Container>
        );
    }

    return (
        <section className="relative py-12 md:py-20">
            <Container size="lg">
                {/* Top controls */}
                <div className="mb-10 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <FlowStepper currentStepIndex={history.length - 1} totalSteps={5} />
                        <div className="w-32">
                            <ProgressIndicator progress={progress} />
                        </div>
                    </div>
                    <FlowNavigation canGoBack={canGoBack} onBack={goBack} onRestart={restart} />
                </div>

                {/* Main content */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {isComplete && currentStep.type === 'result' ? (
                            <ResultScreen
                                key="result"
                                title={currentStep.title}
                                description={currentStep.description}
                                recommendations={recommendations}
                                journey={journeySummary}
                                onRestart={restart}
                            />
                        ) : currentStep.type === 'question' ? (
                            <AnimatedQuestion key={currentStep.id} step={currentStep} onSelect={selectOption} />
                        ) : null}
                    </AnimatePresence>
                </div>
            </Container>
        </section>
    );
}