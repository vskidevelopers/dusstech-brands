'use client';

import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { QuotationFormData } from '../schema';

interface TotalsCardProps {
    control: Control<QuotationFormData>;
    watch: UseFormWatch<QuotationFormData>;
    setValue: UseFormSetValue<QuotationFormData>;
    totals: { subtotal: number; discount: number; vatAmount: number; grandTotal: number };
}

export function TotalsCard({ control, watch, setValue, totals }: TotalsCardProps) {
    const vatEnabled = watch('vat_enabled');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">KES {totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

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

                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                        <Label>Enable VAT</Label>
                        <p className="text-xs text-muted-foreground">Apply tax to subtotal</p>
                    </div>
                    <Controller
                        name="vat_enabled"
                        control={control}
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={(v) => {
                                field.onChange(v);
                                if (!v) setValue('vat_percentage', 0);
                            }} />
                        )}
                    />
                </div>

                {vatEnabled && (
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

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span>KES {totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </CardContent>
        </Card>
    );
}