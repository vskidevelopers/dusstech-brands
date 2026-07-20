/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from './EmptyState';
import { fadeInUp } from '../animations';

export function ActivityCard() {
    return (
        <motion.div variants={fadeInUp as any}>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        icon={Clock}
                        title="No activity yet"
                        description="Customer inquiries, quotations and orders will appear here once your business becomes active."
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}