'use client';

import { Controller, type Control } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon } from 'lucide-react';
import { SectionCard } from './SectionCard';
import type { SettingsFormData } from '../schema';

export function SystemSettingsCard({ control }: { control: Control<SettingsFormData> }) {
    const toggles: {
        name: 'maintenance_mode' | 'allow_guest_orders' | 'allow_guest_checkout';
        label: string;
        description: string;
    }[] = [
            {
                name: 'maintenance_mode',
                label: 'Maintenance Mode',
                description: 'Take the public website offline for maintenance.'
            },
            {
                name: 'allow_guest_orders',
                label: 'Allow Guest Orders',
                description: 'Let customers place orders without creating an account.'
            },
            {
                name: 'allow_guest_checkout',
                label: 'Allow Guest Checkout',
                description: 'Let customers checkout without an account.'
            },
        ];

    return (
        <SectionCard id="system" title="System" icon={SettingsIcon} description="Platform-wide settings.">
            <div className="space-y-3">
                {toggles.map(({ name, label, description }) => (
                    <div key={name} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                            <Label>{label}</Label>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}