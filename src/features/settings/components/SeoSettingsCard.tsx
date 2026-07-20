/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

export function SeoSettingsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="seo" title="Website SEO" icon={Search} description="Default SEO values for the public website.">
            <div className="space-y-4">
                <FormField label="Default Meta Title" error={errors.default_meta_title?.message} hint="Max 70 characters.">
                    <Controller name="default_meta_title" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} maxLength={70} />} />
                </FormField>
                <FormField label="Default Meta Description" error={errors.default_meta_description?.message} hint="Max 160 characters.">
                    <Controller name="default_meta_description" control={control}
                        render={({ field }) => <Textarea {...field} value={field.value ?? ''} rows={3} maxLength={160} />} />
                </FormField>
                <FormField label="Default Keywords" error={errors.default_keywords?.message} hint="Comma-separated.">
                    <Controller name="default_keywords" control={control}
                        render={({ field }) => <Input {...field} value={field.value ?? ''} placeholder="branding, printing, signage" />} />
                </FormField>
            </div>
        </SectionCard>
    );
}