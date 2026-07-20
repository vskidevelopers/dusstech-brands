/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller, useWatch, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateTotals } from '@/lib/order-calculations';
import { generateQuotationPdf } from '@/lib/pdf-generator';
import { quotationInputSchema, type QuotationFormData } from '../schema';
import {
    createQuotationAction,
    updateQuotationAction,
    getQuotationPdfDataAction
} from '../actions';
import { CustomerCard } from './CustomerCard';
import { LineItemsTable } from './LineItemsTable';
import { TotalsCard } from './TotalsCard';
import { NotesEditor } from './NotesEditor';
import { TermsEditor } from './TermsEditor';
import type { QuotationWithItems } from '../types';

interface QuotationBuilderProps {
    mode: 'create' | 'edit';
    initialData?: QuotationWithItems;
}

export function QuotationBuilder({ mode, initialData }: QuotationBuilderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDownloading, setIsDownloading] = useState(false);

    const methods = useForm<QuotationFormData>({
        resolver: zodResolver(quotationInputSchema) as any,
        defaultValues: initialData
            ? {
                customer_name: (initialData as any).customer_name ?? '',
                company_name: (initialData as any).company_name ?? '',
                phone: (initialData as any).phone ?? '',
                email: (initialData as any).email ?? '',
                valid_until: (initialData as any).valid_until ?? '',
                notes: (initialData as any).notes ?? '',
                terms: (initialData as any).terms ?? 'Payment is due within 14 days of invoice date.\n50% deposit required for custom branding projects.',
                discount: (initialData as any).discount ?? 0,
                vat_enabled: (initialData as any).vat_enabled ?? true,
                vat_percentage: (initialData as any).vat_percentage ?? 16,
                items: ((initialData as any).items ?? []).map((item: any) => ({
                    item_type: (item.item_type as 'custom' | 'service' | 'product') ?? 'custom',
                    reference_id: item.reference_id ?? undefined,
                    description: item.description ?? '',
                    quantity: Number(item.quantity) ?? 1,
                    unit_price: Number(item.unit_price) ?? 0,
                    discount: Number(item.discount) ?? 0,
                    line_total: Number(item.line_total) ?? 0,
                    sort_order: item.sort_order ?? 0,
                })),
            }
            : {
                customer_name: '', company_name: '', phone: '', email: '',
                valid_until: '', notes: '',
                terms: 'Payment is due within 14 days of invoice date.\n50% deposit required for custom branding projects.',
                discount: 0, vat_enabled: true, vat_percentage: 16,
                items: [{ item_type: 'custom' as const, description: '', quantity: 1, unit_price: 0, discount: 0, line_total: 0, sort_order: 0 }],
            },
    });

    const { control, handleSubmit, watch, setValue, formState: { errors } } = methods;
    const { fields, append, remove, update } = useFieldArray({ control, name: 'items' });

    const watchedItems = watch('items');
    const watchedDiscount = watch('discount');
    const watchedVatEnabled = watch('vat_enabled');
    const watchedVatPercentage = watch('vat_percentage');

    const totals = useMemo(
        () => calculateTotals(watchedItems, watchedDiscount, watchedVatEnabled, watchedVatPercentage, 0),
        [watchedItems, watchedDiscount, watchedVatEnabled, watchedVatPercentage]
    );

    // Standard Save
    const onSubmit = (data: QuotationFormData) => {
        startTransition(async () => {
            const action = mode === 'create' ? createQuotationAction(data) : updateQuotationAction(initialData!.id, data);
            const result = await action;

            if (result.success) {
                toast.success(mode === 'create' ? 'Quotation created' : 'Quotation updated');
                if (mode === 'create' && result.data) {
                    router.push(`/admin/quotations/${result.data.id}/edit`);
                } else {
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

    // Save AND Download PDF
    const onSaveAndDownload = async (data: QuotationFormData) => {
        setIsDownloading(true);
        try {
            const action = mode === 'create' ? createQuotationAction(data) : updateQuotationAction(initialData!.id, data);
            const result = await action;

            if (result.success && result.data) {
                toast.success(mode === 'create' ? 'Quotation created' : 'Quotation updated');

                // Fetch the complete data needed for the PDF
                const pdfData = await getQuotationPdfDataAction(result.data.id);

                if (pdfData && pdfData.settings) {
                    generateQuotationPdf({
                        quotation: pdfData.quotation,
                        settings: pdfData.settings,
                    });
                    toast.success('PDF downloaded successfully');
                } else {
                    toast.error('Could not load quotation data for PDF');
                }

                if (mode === 'create') {
                    router.push(`/admin/quotations/${result.data.id}/edit`);
                } else {
                    router.refresh();
                }
            } else {
                toast.error(result.error ?? 'Failed to save');
            }
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    // Download PDF only (for edit mode)
    const onDownloadOnly = async () => {
        if (!initialData?.id) return;
        setIsDownloading(true);
        try {
            // Ensure current form changes are saved first if dirty, or just fetch latest
            const pdfData = await getQuotationPdfDataAction(initialData.id);
            if (pdfData && pdfData.settings) {
                generateQuotationPdf({
                    quotation: pdfData.quotation,
                    settings: pdfData.settings,
                });
                toast.success('PDF downloaded successfully');
            }
        } catch (error) {
            toast.error('Failed to generate PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Top Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/quotations" aria-label="Back to quotations">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {mode === 'create' ? 'New Quotation' : (initialData as any)?.quote_number}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {mode === 'create'
                                    ? 'Create a new quotation for a customer.'
                                    : `Editing quotation for ${(initialData as any)?.customer_name}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/admin/quotations')}
                            disabled={isPending || isDownloading}
                        >
                            Cancel
                        </Button>

                        {mode === 'edit' && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onDownloadOnly}
                                disabled={isPending || isDownloading}
                            >
                                {isDownloading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileText className="mr-2 h-4 w-4" />
                                )}
                                Download PDF
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isPending || isDownloading}
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Draft
                        </Button>

                        <Button
                            type="button"
                            disabled={isPending || isDownloading}
                            onClick={handleSubmit(onSaveAndDownload)}
                        >
                            {(isPending || isDownloading) ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
                            {mode === 'create' ? 'Save & Download PDF' : 'Save & Download PDF'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <CustomerCard control={control as any} errors={errors} />
                        <Card>
                            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
                            <CardContent>
                                <LineItemsTable
                                    fields={fields}
                                    control={control as any}
                                    append={append}
                                    remove={remove}
                                    update={update}
                                />
                            </CardContent>
                        </Card>
                        <NotesEditor control={control as any} />
                        <TermsEditor control={control as any} />
                    </div>

                    <div className="space-y-6">
                        <TotalsCard control={control as any} watch={watch} setValue={setValue} totals={totals} />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}