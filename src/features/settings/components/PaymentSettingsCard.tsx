/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

export function PaymentSettingsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="payments" title="Payments" icon={CreditCard} description="M-Pesa and payment configuration.">
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                        <Label>Payments Enabled</Label>
                        <p className="text-xs text-muted-foreground">Accept payments through the platform.</p>
                    </div>
                    <Controller name="payments_enabled" control={control}
                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="M-Pesa Paybill Number" error={errors.mpesa_paybill?.message}>
                        <Controller name="mpesa_paybill" control={control}
                            render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                    </FormField>
                    <FormField label="M-Pesa Till Number" error={errors.mpesa_till?.message}>
                        <Controller name="mpesa_till" control={control}
                            render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                    </FormField>
                    <FormField label="M-Pesa Account Name" error={errors.mpesa_account_name?.message}>
                        <Controller name="mpesa_account_name" control={control}
                            render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Dusstech Brands" />} />
                    </FormField>
                </div>
            </div>
        </SectionCard>
    );
}