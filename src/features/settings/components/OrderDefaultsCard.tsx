/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Package } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

export function OrderDefaultsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="orders" title="Order Defaults" icon={Package} description="Default messages for orders.">
            <div className="space-y-4">
                <FormField label="Default Delivery Message" error={errors.default_delivery_message?.message}>
                    <Controller name="default_delivery_message" control={control}
                        render={({ field }) => <Textarea {...field} value={field.value ?? ''} rows={3} placeholder="Thank you for your order. We'll deliver to..." />} />
                </FormField>
                <FormField label="Default Pickup Message" error={errors.default_pickup_message?.message}>
                    <Controller name="default_pickup_message" control={control}
                        render={({ field }) => <Textarea {...field} value={field.value ?? ''} rows={3} placeholder="Your order is ready for pickup at..." />} />
                </FormField>
            </div>
        </SectionCard>
    );
}