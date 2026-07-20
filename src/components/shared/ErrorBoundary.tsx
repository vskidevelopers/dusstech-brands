'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Admin Layout Error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-background p-4">
                    <div className="max-w-md text-center space-y-4">
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                        <h2 className="text-xl font-semibold">Something went wrong</h2>
                        <p className="text-muted-foreground">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <Button onClick={this.handleReset} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}