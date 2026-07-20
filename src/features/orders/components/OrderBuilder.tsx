/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save, Copy } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateTotals } from '@/lib/order-calculations';
import { PRODUCTION_STATUS_LABELS, type ProductionStatus } from '../types';
import { orderInputSchema, type OrderFormData } from '../schema';
import { createOrderAction, updateOrderAction, duplicateOrderAction } from '../actions';
import { CustomerCard } from './CustomerCard';
import { OrderItemsTable } from './OrderItemsTable';
import { TotalsCard } from './TotalsCard';
import { Timeline } from './Timeline';
import { PreviousOrdersCard } from './PreviousOrdersCard';
import type { OrderWithTimeline, CustomerOrderHistory } from '../types';

interface OrderBuilderProps {
    mode: 'create' | 'edit';
    initialData?: OrderWithTimeline;
    customerHistory?: CustomerOrderHistory;
}

export function OrderBuilder({ mode, initialData, customerHistory }: OrderBuilderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderInputSchema) as any,
        defaultValues: initialData
            ? {
                source: (initialData as any).source ?? 'admin',
                quotation_id: (initialData as any).quotation_id ?? null,
                customer_name: (initialData as any).customer_name ?? '',
                company_name: (initialData as any).company_name ?? '',
                phone: (initialData as any).phone ?? '',
                email: (initialData as any).email ?? '',
                delivery_method: (initialData as any).delivery_method ?? 'pickup',
                delivery_location: (initialData as any).delivery_location ?? '',
                delivery_fee: (initialData as any).delivery_fee ?? 0,
                payment_option: (initialData as any).payment_option ?? 'pay_later',
                payment_status: (initialData as any).payment_status ?? 'pending',
                production_status: (initialData as any).production_status ?? 'new',
                notes: (initialData as any).notes ?? '',
                discount: (initialData as any).discount ?? 0,
                vat_enabled: (initialData as any).vat_enabled ?? true,
                vat_percentage: (initialData as any).vat_percentage ?? 16,
                items: ((initialData as any).items ?? []).map((item: any) => ({
                    item_type: item.item_type,
                    reference_id: item.reference_id ?? undefined,
                    description: item.description ?? '',
                    quantity: Number(item.quantity) ?? 1,
                    unit_price: Number(item.unit_price) ?? 0,
                    discount: Number(item.discount) ?? 0,
                    line_total: Number(item.line_total) ?? 0,
                    sort_order: item.sort_order ?? 0,
                })),
            }
            : {
                source: 'admin',
                quotation_id: null,
                customer_name: '',
                company_name: '',
                phone: '',
                email: '',
                delivery_method: 'pickup',
                delivery_location: '',
                delivery_fee: 0,
                payment_option: 'pay_later',
                payment_status: 'pending',
                production_status: 'new',
                notes: '',
                discount: 0,
                vat_enabled: true,
                vat_percentage: 16,
                items: [
                    {
                        item_type: 'custom' as const,
                        description: '',
                        quantity: 1,
                        unit_price: 0,
                        discount: 0,
                        line_total: 0,
                        sort_order: 0,
                    },
                ],
            },
    });

    const { fields, append, remove, update } = useFieldArray({ control, name: 'items' });

    const watchedItems = watch('items');
    const watchedDiscount = watch('discount');
    const watchedVatEnabled = watch('vat_enabled');
    const watchedVatPercentage = watch('vat_percentage');
    const watchedDeliveryFee = watch('delivery_fee');
    const watchedPhone = watch('phone');

    const totals = useMemo(
        () =>
            calculateTotals(
                watchedItems,
                watchedDiscount,
                watchedVatEnabled,
                watchedVatPercentage,
                watchedDeliveryFee
            ),
        [watchedItems, watchedDiscount, watchedVatEnabled, watchedVatPercentage, watchedDeliveryFee]
    );

    const onSubmit = (data: OrderFormData) => {
        startTransition(async () => {
            const action =
                mode === 'create' ? createOrderAction(data) : updateOrderAction(initialData!.id, data);
            const result = await action;

            if (result.success) {
                toast.success(mode === 'create' ? 'Order created' : 'Order updated');
                if (mode === 'create' && result.data) {
                    router.push(`/admin/orders/${result.data.id}/edit`);
                } else {
                    router.refresh();
                }
            } else {
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, msg]) => {
                        toast.error(`${field}: ${Array.isArray(msg) ? msg[0] : msg}`);
                    });
                } else {
                    toast.error(result.error ?? 'Failed to save');
                }
            }
        });
    };

    const handleDuplicate = () => {
        if (!initialData) return;
        startTransition(async () => {
            const result = await duplicateOrderAction(initialData.id);
            if (result.success && result.data) {
                toast.success('Order duplicated');
                router.push(`/admin/orders/${result.data.id}/edit`);
            } else {
                toast.error(result.error ?? 'Failed to duplicate');
            }
        });
    };

    return (
        <form className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/orders" aria-label="Back to orders">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {mode === 'create' ? 'New Order' : (initialData as any)?.order_number}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Create a new production order.'
                                : `Order for ${(initialData as any)?.customer_name}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/orders')}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    {mode === 'edit' && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDuplicate}
                            disabled={isPending}
                        >
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </Button>
                    )}
                    <Button type="button" disabled={isPending} onClick={handleSubmit(onSubmit) as any}>
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Order
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Column */}
                <div className="space-y-6 lg:col-span-2">
                    <CustomerCard control={control as any} errors={errors} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderItemsTable
                                fields={fields}
                                control={control as any}
                                append={append}
                                remove={remove}
                                update={update}
                            />
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Internal Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        value={field.value ?? ''}
                                        rows={4}
                                        placeholder="Production notes, special instructions, etc."
                                        className="flex w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Timeline (edit mode only) */}
                    {mode === 'edit' && initialData?.timeline && (
                        <Timeline events={initialData.timeline} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <TotalsCard control={control as any} totals={totals} />

                    {/* Production Status (edit mode only) */}
                    {mode === 'edit' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Production Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Controller
                                    name="production_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={(v) => field.onChange(v as ProductionStatus)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(PRODUCTION_STATUS_LABELS).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Previous Orders (edit mode only) */}
                    {mode === 'edit' && (
                        <PreviousOrdersCard
                            phone={watchedPhone}
                            history={
                                customerHistory ?? { totalOrders: 0, latestOrderDate: null, recentOrders: [] }
                            }
                            currentOrderId={initialData?.id}
                        />
                    )}
                </div>
            </div>
        </form>
    );
}