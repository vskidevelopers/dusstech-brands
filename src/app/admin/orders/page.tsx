/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Package, MoreHorizontal, Edit, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/shared/Pagination';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { getOrders } from '@/features/orders/queries';
import { OrderFilters } from '@/features/orders/components/OrderFilters';
import { ProductionStatusBadge } from '@/features/orders/components/ProductionStatusBadge';
import { PaymentStatusBadge } from '@/features/orders/components/PaymentStatusBadge';
import type { OrderFilters as OrderFiltersType, ProductionStatus, PaymentStatus, OrderSource } from '@/features/orders/types';

interface OrdersPageProps {
    searchParams: Promise<{
        search?: string;
        productionStatus?: string;
        paymentStatus?: string;
        source?: string;
        page?: string;
        pageSize?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;

    const filters: OrderFiltersType = {
        search: params.search,
        productionStatus: (params.productionStatus as ProductionStatus) ?? 'all',
        paymentStatus: (params.paymentStatus as PaymentStatus) ?? 'all',
        source: (params.source as OrderSource) ?? 'all',
        page: params.page ? parseInt(params.page, 10) : 1,
        pageSize: params.pageSize ? parseInt(params.pageSize, 10) : DEFAULT_PAGE_SIZE,
    };

    const result = await getOrders(filters);
    const hasFilters = !!(filters.search || filters.productionStatus !== 'all' || filters.paymentStatus !== 'all' || filters.source !== 'all');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage production jobs from creation to completion.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/orders/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Order
                    </Link>
                </Button>
            </div>

            <OrderFilters />

            {result.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 text-base font-semibold">
                        {hasFilters ? 'No orders match your filters' : 'No orders yet'}
                    </h3>
                    <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                        {hasFilters
                            ? 'Try adjusting your search or filters.'
                            : 'Get started by creating your first production order.'}
                    </p>
                    {!hasFilters && (
                        <Button asChild>
                            <Link href="/admin/orders/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Order
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                                    <TableHead>Production</TableHead>
                                    <TableHead className="hidden lg:table-cell">Payment</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="hidden xl:table-cell">Source</TableHead>
                                    <TableHead className="hidden xl:table-cell">Created</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/orders/${order.id}/edit`} className="hover:text-primary hover:underline">
                                                {((order as any).order_number ?? order.id)}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{order.customer_name}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground tabular-nums">
                                            {order.phone}
                                        </TableCell>
                                        <TableCell>
                                            <ProductionStatusBadge status={((order as any).production_status ?? (order as any).productionStatus) as ProductionStatus} />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <PaymentStatusBadge status={((order as any).payment_status ?? (order as any).paymentStatus) as PaymentStatus} />
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            KES {Number(order.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell capitalize text-muted-foreground">
                                            {((order as any).source)}
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">
                                            {format(new Date(order.created_at), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/orders/${order.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/orders/new?duplicate=${order.id}`}>
                                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Archive
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination page={result.page} pageSize={result.pageSize} totalCount={result.count} />
                </>
            )}
        </div>
    );
}