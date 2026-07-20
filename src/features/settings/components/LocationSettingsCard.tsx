/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

export function LocationSettingsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="location" title="Location" icon={MapPin} description="Physical business address.">
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Building" error={errors.building?.message}>
                    <Controller name="building" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Munyu Business Plaza" />} />
                </FormField>
                <FormField label="Street" error={errors.street?.message}>
                    <Controller name="street" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Munyu Road" />} />
                </FormField>
                <FormField label="Address" error={errors.address?.message}>
                    <Controller name="address" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                </FormField>
                <FormField label="City" error={errors.city?.message}>
                    <Controller name="city" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="Nairobi" />} />
                </FormField>
                <FormField label="County" error={errors.county?.message}>
                    <Controller name="county" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} />} />
                </FormField>
                <FormField label="Country" error={errors.country?.message} required>
                    <Controller name="country" control={control}
                        render={({ field }) => <Input {...field} />} />
                </FormField>
                <FormField label="Google Maps URL" error={errors.google_maps_url?.message} hint="Link to your location on Google Maps.">
                    <Controller name="google_maps_url" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="https://maps.google.com/..." />} />
                </FormField>
            </div>
        </SectionCard>
    );
}