'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TotalsBreakdown } from '@/lib/order-calculations';
import type { OrderFormData } from '../schema';

interface TotalsCardProps {
    control: Control<OrderFormData>;
    totals: TotalsBreakdown;
}

function formatKES(value: number): string {
    return `KES ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function TotalsCard({ control, totals }: TotalsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Source */}
                <div className="space-y-2">
                    <Label>Source</Label>
                    <Controller
                        name="source"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin Created</SelectItem>
                                    <SelectItem value="quotation">From Quotation</SelectItem>
                                    <SelectItem value="website">Website Checkout</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Payment Option */}
                <div className="space-y-2">
                    <Label>Payment Option</Label>
                    <Controller
                        name="payment_option"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pay_later">Pay Later</SelectItem>
                                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Controller
                        name="payment_status"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <Separator />

                {/* Financials */}
                <div className="space-y-2 text-sm">
                    <Row label="Subtotal" value={formatKES(totals.subtotal)} />
                    {totals.discount > 0 && <Row label="Discount" value={`-${formatKES(totals.discount)}`} />}
                    {totals.vatAmount > 0 && (
                        <Row label={`VAT (${control._formValues.vat_percentage}%)`} value={formatKES(totals.vatAmount)} />
                    )}
                    {totals.deliveryFee && totals.deliveryFee > 0 && (
                        <Row label="Delivery Fee" value={formatKES(totals.deliveryFee)} />
                    )}
                </div>

                <Separator />

                {/* Discount & VAT Inputs */}
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Global Discount (KES)</Label>
                        <Controller
                            name="discount"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="number" min="0" step="0.01" className="text-right" />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable VAT</Label>
                            <p className="text-xs text-muted-foreground">Apply tax to subtotal</p>
                        </div>
                        <Controller
                            name="vat_enabled"
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>

                    {control._formValues.vat_enabled && (
                        <div className="space-y-2">
                            <Label>VAT Percentage (%)</Label>
                            <Controller
                                name="vat_percentage"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} type="number" min="0" max="100" step="0.01" className="text-right" />
                                )}
                            />
                        </div>
                    )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                    <span>Final Total</span>
                    <span>{formatKES(totals.finalTotal)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
        </div>
    );
}