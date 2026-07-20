/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ImageIcon, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/utils/slugify';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { CollectionMultiSelect } from '@/components/shared/CollectionMultiSelect';
import { RichTextEditor } from './RichTextEditor';
import { ServiceFormMedia } from './ServiceFormMedia';
import { createServiceAction, updateServiceAction } from '../actions';
import { serviceInputSchema, type ServiceFormData } from '../schema';
import type { Service } from '../types';
import type { Collection } from '@/features/collections/types';
import { MediaPicker } from '@/features/media/components/MediaPicker';
import type { MediaItem } from '@/features/media/types';

interface ServiceFormProps {
    mode: 'create' | 'edit';
    initialData?: Service;
    initialCollectionIds?: string[];
    availableCollections?: Collection[];
}

export function ServiceForm({
    mode, initialData, initialCollectionIds = [], availableCollections = [],
}: ServiceFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    const getInitialPricingType = (): ServiceFormData['pricing_type'] => {
        if (initialData?.pricing_type === 'fixed'
            || initialData?.pricing_type === 'starting_from'
            || initialData?.pricing_type === 'custom_quote') {
            return initialData.pricing_type;
        }

        return 'starting_from';
    };

    const {
        register, handleSubmit, control, watch, setValue, formState: { errors },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceInputSchema) as any,
        defaultValues: {
            name: initialData?.name ?? '',
            slug: initialData?.slug ?? '',
            short_description: initialData?.short_description ?? '',
            description: initialData?.description ?? '',
            category_id: initialData?.category_id ?? null,
            collection_ids: initialCollectionIds,
            starting_price: initialData?.starting_price ?? 0,
            pricing_type: getInitialPricingType(),
            featured: initialData?.featured ?? false,
            active: initialData?.active ?? true,
            featured_image: initialData?.featured_image ?? '',
            gallery: initialData?.gallery ?? [],
            turnaround_time: initialData?.turnaround_time ?? '',
            whatsapp_message: initialData?.whatsapp_message ?? '',
            seo_title: initialData?.seo_title ?? '',
            seo_description: initialData?.seo_description ?? '',
        },
    });

    const watchedName = watch('name');

    useEffect(() => {
        if (!slugManuallyEdited && watchedName) {
            setValue('slug', slugify(watchedName));
        }
    }, [watchedName, slugManuallyEdited, setValue]);

    const onSubmit = (data: ServiceFormData, continueEditing: boolean) => {
        startTransition(async () => {
            const action = mode === 'create'
                ? createServiceAction(data)
                : updateServiceAction(initialData!.id, data);

            const result = await action;

            if (result.success && result.data) {
                toast.success(mode === 'create' ? 'Service created' : 'Service updated');
                if (continueEditing && mode === 'create') {
                    router.push(`/admin/services/${result.data.id}/edit`);
                } else if (!continueEditing) {
                    router.push('/admin/services');
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
                        <Link href="/admin/services" aria-label="Back to services">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {mode === 'create' ? 'New Service' : 'Edit Service'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Add a new branding service to your catalog.'
                                : `Editing ${initialData?.name}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/services')} disabled={isPending}>
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
                    {/* General */}
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>Core details about this service.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Name" error={errors.name?.message} required>
                                <Input {...register('name')} placeholder="e.g. Jersey Branding" className={errors.name && 'border-destructive'} />
                            </FormField>
                            <FormField label="Slug" error={errors.slug?.message} required hint="URL-friendly identifier. Auto-generated from name.">
                                <Input
                                    {...register('slug')}
                                    onBlur={() => setSlugManuallyEdited(true)}
                                    placeholder="jersey-branding"
                                    className={cn('font-mono text-sm', errors.slug && 'border-destructive')}
                                />
                            </FormField>
                            <FormField label="Short Description" error={errors.short_description?.message} hint="Max 200 characters.">
                                <Textarea {...register('short_description')} rows={2} placeholder="Brief overview..." />
                            </FormField>
                            <FormField label="Description" error={errors.description?.message} hint="Full rich-text description.">
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value ?? ''}
                                            onChange={field.onChange}
                                            placeholder="Describe what this service includes..."
                                        />
                                    )}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>Images for this service.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Controller
                                name="featured_image"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>Featured Image</Label>

                                        {field.value ? (
                                            <div className="relative w-full max-w-xs aspect-video rounded-lg border overflow-hidden group">
                                                <img src={field.value} alt="Featured" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange('')}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full max-w-xs h-32 flex flex-col gap-2"
                                                onClick={() => setIsMediaPickerOpen(true)}
                                            >
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Select Image</span>
                                            </Button>
                                        )}

                                        <MediaPicker
                                            open={isMediaPickerOpen}
                                            onOpenChange={setIsMediaPickerOpen}
                                            folder="services"
                                            multiple={false}
                                            onSelect={(media) => {
                                                console.log("🔥 STEP 8: MediaPicker onSelect triggered. Raw media payload:", media);

                                                const selectedMedia = Array.isArray(media) ? media[0] : media;

                                                if (selectedMedia && selectedMedia.secure_url) {
                                                    console.log("✅ STEP 8 COMPLETE: Setting form 'featured_image' to:", selectedMedia.secure_url);
                                                    field.onChange(selectedMedia.secure_url);
                                                    toast.success("Image attached to form!");
                                                } else {
                                                    console.error("❌ STEP 8 FAILED: selectedMedia or secure_url is missing!", selectedMedia);
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO</CardTitle>
                            <CardDescription>Optimize how this service appears in search engines.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="SEO Title" error={errors.seo_title?.message} hint="Max 70 characters.">
                                <Input {...register('seo_title')} placeholder="Custom page title" />
                            </FormField>
                            <FormField label="SEO Description" error={errors.seo_description?.message} hint="Max 160 characters.">
                                <Textarea {...register('seo_description')} rows={2} placeholder="Custom meta description..." />
                            </FormField>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToggleRow label="Active" description="Visible on website" control={control} name="active" />
                            <ToggleRow label="Featured" description="Highlight on homepage" control={control} name="featured" />
                        </CardContent>
                    </Card>

                    {/* Classification */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Category" error={errors.category_id?.message}>
                                <Controller
                                    name="category_id"
                                    control={control}
                                    render={({ field }) => (
                                        <CategorySelect
                                            value={field.value ?? null}
                                            onChange={(v) => field.onChange(v)}
                                        />
                                    )}
                                />
                            </FormField>

                            <FormField label="Collections" error={errors.collection_ids?.message} hint="Assign this service to marketing collections.">
                                <Controller
                                    name="collection_ids"
                                    control={control}
                                    render={({ field }) => (
                                        <CollectionMultiSelect
                                            value={field.value ?? []}
                                            onChange={(v) => field.onChange(v)}
                                            collections={availableCollections}
                                        />
                                    )}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Starting Price (KES)" error={errors.starting_price?.message} required>
                                <Input type="number" step="0.01" min="0" {...register('starting_price', { valueAsNumber: true })} className={errors.starting_price && 'border-destructive'} />
                            </FormField>
                            <FormField label="Pricing Type" error={errors.pricing_type?.message} required>
                                <Controller
                                    name="pricing_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed price</SelectItem>
                                                <SelectItem value="starting_from">Starting from</SelectItem>
                                                <SelectItem value="custom_quote">Custom quote</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label="Turnaround Time" error={errors.turnaround_time?.message}>
                                <Input {...register('turnaround_time')} placeholder="e.g. 3-5 business days" />
                            </FormField>
                            <FormField label="WhatsApp Message" error={errors.whatsapp_message?.message} hint="Pre-filled message when customers inquire via WhatsApp.">
                                <Textarea {...register('whatsapp_message')} rows={3} placeholder="Hi, I'm interested in..." />
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
    control: Control<ServiceFormData>;
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