'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/website/ui/Button';

interface FlowNavigationProps {
    canGoBack: boolean;
    onBack: () => void;
    onRestart: () => void;
}

export function FlowNavigation({ canGoBack, onBack, onRestart }: FlowNavigationProps) {
    return (
        <div className="flex items-center justify-between">
            <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                disabled={!canGoBack}
                className="gap-1.5"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={onRestart}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
                <RotateCcw className="h-3.5 w-3.5" />
                Start Over
            </Button>
        </div>
    );
}