/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { format } from 'date-fns';
import { History, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductionStatusBadge } from './ProductionStatusBadge';
import type { CustomerOrderHistory, Order } from '../types';

interface PreviousOrdersCardProps {
    phone: string | null;
    history: CustomerOrderHistory;
    currentOrderId?: string;
}

export function PreviousOrdersCard({ phone, history, currentOrderId }: PreviousOrdersCardProps) {
    if (!phone || history.totalOrders === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <History className="h-4 w-4 text-muted-foreground" />
                        Customer History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center py-6 text-center">
                        <Package className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            {phone ? 'No previous orders for this phone number.' : 'Enter a phone number to view customer history.'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Customer History
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold tabular-nums">{history.totalOrders}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">Latest Order</p>
                        <p className="text-sm font-medium tabular-nums">
                            {history.latestOrderDate
                                ? format(new Date(history.latestOrderDate), 'MMM d, yyyy')
                                : '—'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Recent Orders
                    </p>
                    <div className="space-y-1.5">
                        {history.recentOrders.slice(0, 5).map((order) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}/edit`}
                                className="flex items-center justify-between rounded-md border p-2 text-sm transition-colors hover:bg-accent"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{(order as any).order_number ?? order.id}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <ProductionStatusBadge status={(order as any).production_status} />
                            </Link>
                        ))}
                    </div>
                </div>

                {history.totalOrders > 5 && (
                    <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href={`/admin/orders?search=${encodeURIComponent(phone)}`}>
                            View all {history.totalOrders} orders
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}