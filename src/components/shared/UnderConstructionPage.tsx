'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface UnderConstructionPageProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    showBackButton?: boolean;
}

export function UnderConstructionPage({
    title = 'Coming Soon',
    description = "We're building something great. This section will be available shortly.",
    icon: Icon = Construction,
    showBackButton = true,
}: UnderConstructionPageProps) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="overflow-hidden border-0 shadow-xl">
                    {/* Decorative gradient bar */}
                    <div
                        className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
                        aria-hidden
                    />

                    <CardContent className="flex flex-col items-center p-8 text-center">
                        {/* Animated icon container */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                            className="relative mb-6"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40">
                                <Icon className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                            </div>
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-zinc-900"
                            >
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            </motion.div>
                        </motion.div>

                        {/* Status badge */}
                        <Badge
                            variant="secondary"
                            className="mb-4 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
                        >
                            Under Construction
                        </Badge>

                        {/* Title */}
                        <h1 className="mb-2 text-2xl font-bold tracking-tight">{title}</h1>

                        {/* Description */}
                        <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>

                        {/* Back button */}
                        {showBackButton && (
                            <Button asChild variant="outline" size="sm">
                                <Link href="/admin">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Footer hint */}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Need this feature sooner?{' '}
                    <a
                        href="mailto:support@dusstech.co.ke"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Contact support
                    </a>
                </p>
            </motion.div>
        </div>
    );
}