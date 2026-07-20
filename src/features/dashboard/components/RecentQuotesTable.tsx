/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { EmptyState } from './EmptyState';
import { fadeInUp } from '../animations';
import type { QuoteRow } from '../types';

interface RecentQuotesTableProps {
    quotes: QuoteRow[];
}

export function RecentQuotesTable({ quotes }: RecentQuotesTableProps) {
    return (
        <motion.div variants={fadeInUp as any}>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Pending Quotations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {quotes.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="No quotations yet"
                            description="Quotations you create for customers will appear here for easy tracking."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quote Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotes.map((quote) => (
                                    <TableRow key={quote.id}>
                                        <TableCell className="font-medium">{quote.id}</TableCell>
                                        <TableCell>{quote.customer}</TableCell>
                                        <TableCell>{quote.status}</TableCell>
                                        <TableCell>{quote.created}</TableCell>
                                        <TableCell className="text-right">{quote.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}