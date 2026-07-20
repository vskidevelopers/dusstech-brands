/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, type Control } from 'react-hook-form';
import { User, Building2, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { QuotationFormData } from '../schema';

interface CustomerCardProps {
    control: Control<QuotationFormData>;
    errors: any;
}

export function CustomerCard({ control, errors }: CustomerCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>Who is this quotation for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Customer Name (Required) */}
                <FormField
                    label="Customer Name"
                    error={errors.customer_name?.message}
                    required
                    icon={<User className="h-4 w-4" />}
                >
                    <Controller
                        name="customer_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="e.g. John Doe"
                                className={errors.customer_name && 'border-destructive'}
                            />
                        )}
                    />
                </FormField>

                {/* Company Name */}
                <FormField
                    label="Company"
                    error={errors.company_name?.message}
                    icon={<Building2 className="h-4 w-4" />}
                >
                    <Controller
                        name="company_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                placeholder="e.g. Acme Corporation"
                                className={errors.company_name && 'border-destructive'}
                            />
                        )}
                    />
                </FormField>

                {/* Phone & Email Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        label="Phone"
                        error={errors.phone?.message}
                        icon={<Phone className="h-4 w-4" />}
                    >
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder="+254 700 000 000"
                                    className={errors.phone && 'border-destructive'}
                                />
                            )}
                        />
                    </FormField>

                    <FormField
                        label="Email"
                        error={errors.email?.message}
                        icon={<Mail className="h-4 w-4" />}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    value={field.value ?? ''}
                                    placeholder="customer@example.com"
                                    className={errors.email && 'border-destructive'}
                                />
                            )}
                        />
                    </FormField>
                </div>

                {/* Valid Until */}
                <FormField
                    label="Valid Until"
                    error={errors.valid_until?.message}
                    hint="The date until which this quotation remains valid."
                    icon={<Calendar className="h-4 w-4" />}
                >
                    <Controller
                        name="valid_until"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="date"
                                value={field.value ?? ''}
                                className={errors.valid_until && 'border-destructive'}
                            />
                        )}
                    />
                </FormField>
            </CardContent>
        </Card>
    );
}

/* ---------------- Helper ---------------- */

interface FormFieldProps {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

function FormField({ label, error, hint, required, icon, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}