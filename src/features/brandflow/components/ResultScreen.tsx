'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/website/ui/Button';
import { Heading } from '@/components/website/ui/Heading';
import { RecommendationGrid } from './RecommendationGrid';
import { FlowSummary } from './FlowSummary';
import { cn } from '@/lib/utils';
import type { Recommendation } from '../types';

interface ResultScreenProps {
    title: string;
    description?: string;
    recommendations: Recommendation[];
    journey: Array<{ stepTitle: string; answerLabel: string }>;
    onRestart: () => void;
}

export function ResultScreen({
    title,
    description,
    recommendations,
    journey,
    onRestart,
}: ResultScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
        >
            {/* Header */}
            <div className="mb-10 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-primary-foreground shadow-lg"
                >
                    <Sparkles className="h-7 w-7" />
                </motion.div>
                <Heading level="h2" align="center" className="mb-3">
                    {title}
                </Heading>
                {description && (
                    <p className="text-base text-muted-foreground max-w-xl mx-auto">
                        {description}
                    </p>
                )}
            </div>  {/* ✅ Fixed: was </motion.div> */}

            {/* Journey summary */}
            <div className="mb-8">
                <FlowSummary journey={journey} />
            </div>

            {/* Recommendations */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold tracking-tight mb-4">
                    Recommended for you
                </h3>
                <RecommendationGrid recommendations={recommendations} />
            </div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-6 border-t border-border"
            >
                <a
                    href="/services"
                    className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
                >
                    <Sparkles className="h-4 w-4" />
                    Browse All Services
                </a>
                <a
                    href="/shop"
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                >
                    <ShoppingBag className="h-4 w-4" />
                    Browse Shop
                </a>
                <a
                    href="https://wa.me/254700000000?text=Hi%20Dusstech!%20I%20just%20used%20BrandFlow%20and%20need%20help."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
                >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                </a>
            </motion.div>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={onRestart}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                    Start a new flow
                </button>
            </div>
        </motion.div>
    );
}