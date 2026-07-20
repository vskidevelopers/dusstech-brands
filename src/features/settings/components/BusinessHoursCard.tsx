'use client';

import { Controller, type Control } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { BusinessHoursEditor } from './BusinessHoursEditor';
import type { SettingsFormData } from '../schema';

export function BusinessHoursCard({ control }: { control: Control<SettingsFormData> }) {
    return (
        <SectionCard id="hours" title="Business Hours" icon={Clock} description="When customers can reach you.">
            <Controller
                name="business_hours"
                control={control}
                render={({ field }) => <BusinessHoursEditor value={field.value} onChange={field.onChange} />}
            />
        </SectionCard>
    );
}