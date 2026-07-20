/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils/slugify';
import { createCategoryAction, updateCategoryAction } from '../actions';
import { categoryInputSchema, type CategoryFormData } from '../schema';
import type { Category } from '../types';

const ICON_SUGGESTIONS = ['👕', '🍵', '🏢', '🖨️', '🎁', '🚗', '🪟', '📦', '🎨', '✨'];

interface CategoryFormProps {
    mode: 'create' | 'edit';
    initialData?: Category;
}

export function CategoryForm({ mode, initialData }: CategoryFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const {
        register, handleSubmit, control, watch, setValue, formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categoryInputSchema) as any,
        defaultValues: initialData
            ? {
                name: initialData.name,
                slug: initialData.slug,
                description: initialData.description ?? '',
                icon: initialData.icon ?? '',
                sort_order: initialData.sort_order,
                featured: initialData.featured,
                active: initialData.active,
            }
            : {
                name: '',
                slug: '',
                description: '',
                icon: '',
                sort_order: 0,
                featured: false,
                active: true,
            },
    });

    const watchedName = watch('name');

    useEffect(() => {
        if (!slugManuallyEdited && watchedName) {
            setValue('slug', slugify(watchedName));
        }
    }, [watchedName, slugManuallyEdited, setValue]);

    const onSubmit = (data: CategoryFormData, continueEditing: boolean) => {
        startTransition(async () => {
            const action = mode === 'create'
                ? createCategoryAction(data)
                : updateCategoryAction(initialData!.id, data);

            const result = await action;

            if (result.success && result.data) {
                toast.success(mode === 'create' ? 'Category created' : 'Category updated');
                if (continueEditing && mode === 'create') {
                    router.push(`/admin/categories/${result.data.id}/edit`);
                } else if (!continueEditing) {
                    router.push('/admin/categories');
                    router.refresh();
                }
            } else {
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, msg]) => {
                        toast.error(`${field}: ${Array.isArray(msg) ? msg[0] : msg}`);
                    });
                } else {
                    toast.error(result.error ?? 'Failed to save');
                }
            }
        });
    };

    return (
        <form className="space-y-6">
            {/* Top bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/categories" aria-label="Back to categories">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {mode === 'create' ? 'New Category' : 'Edit Category'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Create a category to organize your services and products.'
                                : `Editing ${initialData?.name}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="button" variant="secondary" disabled={isPending} onClick={handleSubmit((d) => onSubmit(d, true))}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save & Continue
                    </Button>
                    <Button type="button" disabled={isPending} onClick={handleSubmit((d) => onSubmit(d, false))}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>Core details about this category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Name" error={errors.name?.message} required>
                                <Input
                                    {...register('name')}
                                    placeholder="e.g. Clothing"
                                    className={errors.name && 'border-destructive'}
                                />
                            </FormField>

                            <FormField label="Slug" error={errors.slug?.message} required hint="URL-friendly identifier. Auto-generated from name.">
                                <Input
                                    {...register('slug')}
                                    onBlur={() => setSlugManuallyEdited(true)}
                                    placeholder="clothing"
                                    className={cn('font-mono text-sm', errors.slug && 'border-destructive')}
                                />
                            </FormField>

                            <FormField label="Description" error={errors.description?.message} hint="Max 500 characters.">
                                <Textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="A short description of this category..."
                                    className={errors.description && 'border-destructive'}
                                />
                            </FormField>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToggleRow label="Active" description="Visible on website" control={control} name="active" />
                            <ToggleRow label="Featured" description="Highlight on homepage" control={control} name="featured" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Icon" error={errors.icon?.message} hint="Emoji or icon identifier.">
                                <Input
                                    {...register('icon')}
                                    placeholder="👕"
                                    maxLength={50}
                                />
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {ICON_SUGGESTIONS.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setValue('icon', icon, { shouldDirty: true })}
                                            className="flex h-9 w-9 items-center justify-center rounded-md border text-lg transition-colors hover:bg-accent"
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </FormField>

                            <FormField label="Sort Order" error={errors.sort_order?.message} hint="Lower numbers appear first.">
                                <Input
                                    type="number"
                                    min="0"
                                    {...register('sort_order', { valueAsNumber: true })}
                                    className={errors.sort_order && 'border-destructive'}
                                />
                            </FormField>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}

/* ---------------- Helpers ---------------- */

interface FormFieldProps {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
}

function FormField({ label, error, hint, required, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

interface ToggleRowProps {
    label: string;
    description: string;
    control: Control<CategoryFormData>;
    name: 'active' | 'featured';
}

function ToggleRow({ label, description, control, name }: ToggleRowProps) {
    return (
        <div className="flex items-center justify-between">
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
    );
}