/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Building2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

export function GeneralSettingsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="general" title="General" icon={Building2} description="Core business information.">
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Business Name" error={errors.business_name?.message} required>
                    <Controller name="business_name" control={control}
                        render={({ field }) => <Input {...field} className={errors.business_name && 'border-destructive'} />} />
                </FormField>
                <FormField label="Tagline" error={errors.tagline?.message}>
                    <Controller name="tagline" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Own Your Brand" />} />
                </FormField>
                <FormField label="Registration Number" error={errors.registration_number?.message}>
                    <Controller name="registration_number" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                </FormField>
                <FormField label="KRA PIN" error={errors.kra_pin?.message}>
                    <Controller name="kra_pin" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                </FormField>
            </div>
        </SectionCard>
    );
}