/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { fadeInUp } from '../animations';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

export function DashboardHeader() {
    const [greeting, setGreeting] = useState('Hello');
    const [date, setDate] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGreeting(getGreeting());
        setDate(format(new Date(), 'EEEE, MMMM d, yyyy'));
    }, []);

    return (
        <motion.div
            variants={fadeInUp as any}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {greeting} <span aria-hidden>👋</span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Welcome back to Dusstech Brands. Here&apos;s what&apos;s happening with your business today.
                </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{date}</span>
            </div>
        </motion.div>
    );
}