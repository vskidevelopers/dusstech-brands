/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { EmptyState } from './EmptyState';
import { fadeInUp } from '../animations';
import type { OrderRow } from '../types';

interface RecentOrdersTableProps {
    orders: OrderRow[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <motion.div variants={fadeInUp as any}>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        Recent Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <EmptyState
                            icon={ShoppingCart}
                            title="No orders yet"
                            description="Orders from customers will appear here once they start placing orders."
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell className="text-right">{order.amount}</TableCell>
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