/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

export function ContactSettingsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="contact" title="Contact" icon={Phone} description="How customers reach you.">
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Primary Phone" error={errors.phone_primary?.message}>
                    <Controller name="phone_primary" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="+254 700 000 000" />} />
                </FormField>
                <FormField label="Secondary Phone" error={errors.phone_secondary?.message}>
                    <Controller name="phone_secondary" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                </FormField>
                <FormField label="WhatsApp Number" error={errors.whatsapp_number?.message} hint="Used for customer inquiries.">
                    <Controller name="whatsapp_number" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="+254 700 000 000" />} />
                </FormField>
                <FormField label="Email" error={errors.email?.message}>
                    <Controller name="email" control={control}
                        render={({ field }) => <Input {...field} type="email" value={field.value ?? ''} placeholder="info@dusstech.co.ke" />} />
                </FormField>
                <FormField label="Website" error={errors.website?.message}>
                    <Controller name="website" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="https://dusstech.co.ke" />} />
                </FormField>
            </div>
        </SectionCard>
    );
}