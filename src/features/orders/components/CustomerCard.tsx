/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, useWatch, type Control } from 'react-hook-form';
import { User, Building2, Phone, Mail, Truck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { OrderFormData } from '../schema';

interface CustomerCardProps {
    control: Control<OrderFormData>;
    errors: any;
}

export function CustomerCard({ control, errors }: CustomerCardProps) {
    const deliveryMethod = useWatch({ control, name: 'delivery_method' });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer & Delivery</CardTitle>
                <CardDescription>Who is this order for, and how will they receive it?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField label="Customer Name" error={errors.customer_name?.message} required icon={<User className="h-4 w-4" />}>
                    <Controller
                        name="customer_name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="e.g. John Doe" className={errors.customer_name && 'border-destructive'} />
                        )}
                    />
                </FormField>

                <FormField label="Company" error={errors.company_name?.message} icon={<Building2 className="h-4 w-4" />}>
                    <Controller
                        name="company_name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} value={field.value ?? ''} placeholder="e.g. Acme Corporation" />
                        )}
                    />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Phone" error={errors.phone?.message} required icon={<Phone className="h-4 w-4" />}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="+254 700 000 000" className={errors.phone && 'border-destructive'} />
                            )}
                        />
                    </FormField>

                    <FormField label="Email" error={errors.email?.message} icon={<Mail className="h-4 w-4" />}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="email" value={field.value ?? ''} placeholder="customer@example.com" />
                            )}
                        />
                    </FormField>
                </div>

                {/* Delivery Method */}
                <div className="space-y-2 pt-2">
                    <Label className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        Delivery Method
                    </Label>
                    <Controller
                        name="delivery_method"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="flex gap-4"
                            >
                                <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <RadioGroupItem value="pickup" />
                                    <span className="text-sm font-medium">Pickup</span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <RadioGroupItem value="delivery" />
                                    <span className="text-sm font-medium">Delivery</span>
                                </label>
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* Conditional Delivery Fields */}
                {deliveryMethod === 'delivery' && (
                    <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <FormField label="Delivery Location" error={errors.delivery_location?.message} required icon={<MapPin className="h-4 w-4" />}>
                            <Controller
                                name="delivery_location"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={field.value ?? ''}
                                        placeholder="e.g. Westlands, Nairobi"
                                        className={errors.delivery_location && 'border-destructive'}
                                    />
                                )}
                            />
                        </FormField>

                        <FormField label="Delivery Fee (KES)" error={errors.delivery_fee?.message}>
                            <Controller
                                name="delivery_fee"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={cn('text-right', errors.delivery_fee && 'border-destructive')}
                                    />
                                )}
                            />
                        </FormField>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

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