/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { RichTextEditor } from '@/features/services/components/RichTextEditor';
import type { SettingsFormData } from '../schema';

export function QuotationDefaultsCard({
    control, errors,
}: { control: Control<SettingsFormData>; errors: any }) {
    return (
        <SectionCard id="quotations" title="Quotation Defaults" icon={FileText} description="Templates used for new quotations.">
            <div className="space-y-4">
                <FormField label="Default Terms" error={errors.default_terms?.message} hint="Shown on every new quotation. Editable per quotation.">
                    <Controller name="default_terms" control={control}
                        render={({ field }) => (
                            <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder="Payment terms, conditions..." />
                        )} />
                </FormField>

                <FormField label="Default Notes" error={errors.default_notes?.message}>
                    <Controller name="default_notes" control={control}
                        render={({ field }) => (
                            <RichTextEditor value={field.value ?? ''} onChange={field.onChange} placeholder="Thank you message..." />
                        )} />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Default Validity (Days)" error={errors.default_validity_days?.message}>
                        <Controller name="default_validity_days" control={control}
                            render={({ field }) => <Input {...field} type="number" min="1" max="365" />} />
                    </FormField>
                    <FormField label="Currency Code" error={errors.currency?.message}>
                        <Controller name="currency" control={control}
                            render={({ field }) => <Input {...field} placeholder="KES" />} />
                    </FormField>
                    <FormField label="Currency Symbol" error={errors.currency_symbol?.message}>
                        <Controller name="currency_symbol" control={control}
                            render={({ field }) => <Input {...field} placeholder="KES" />} />
                    </FormField>
                    <FormField label="Default VAT %" error={errors.default_vat_percentage?.message}>
                        <Controller name="default_vat_percentage" control={control}
                            render={({ field }) => <Input {...field} type="number" min="0" max="100" step="0.01" />} />
                    </FormField>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                        <Label>VAT Enabled by Default</Label>
                        <p className="text-xs text-muted-foreground">New quotations include VAT by default.</p>
                    </div>
                    <Controller name="vat_enabled" control={control}
                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
                </div>
            </div>
        </SectionCard>
    );
}