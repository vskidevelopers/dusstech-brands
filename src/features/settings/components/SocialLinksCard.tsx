/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Share2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import type { SettingsFormData } from '../schema';

const SOCIAL_FIELDS: { name: keyof SettingsFormData; label: string; placeholder: string }[] = [
    { name: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
    { name: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
    { name: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
    { name: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
];

export function SocialLinksCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="social" title="Social Media" icon={Share2} description="Your social media profiles.">
            <div className="grid gap-4 sm:grid-cols-2">
                {SOCIAL_FIELDS.map(({ name, label, placeholder }) => (
                    <FormField key={name} label={label} error={errors[name]?.message}>
                        <Controller name={name} control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={typeof field.value === 'string' || typeof field.value === 'number' || Array.isArray(field.value)
                                        ? field.value
                                        : ''}
                                    placeholder={placeholder}
                                />
                            )} />
                    </FormField>
                ))}
            </div>
        </SectionCard>
    );
}