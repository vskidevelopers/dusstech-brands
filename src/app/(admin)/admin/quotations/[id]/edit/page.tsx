/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/supabase/requireAuth';
import { QuotationBuilder } from '@/features/quotations/components/QuotationBuilder';
import type { QuotationWithItems } from '@/features/quotations/types';

interface EditQuotationPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditQuotationPage({ params }: EditQuotationPageProps) {
    await requireAuth();

    const { id } = await params;
    const supabase = await createClient();

    // Fetch the quotation with its line items
    const { data: quotation, error } = await supabase
        .from('quotations')
        .select('*, items:quotation_items(*)')
        .eq('id', id)
        .single();

    if (error || !quotation) {
        notFound();
    }

    // Sort items by sort_order for consistent display
    const items = (quotation.items ?? []).sort(
        (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    const quotationWithItems: QuotationWithItems = {
        ...quotation,
        items,
    };

    return <QuotationBuilder mode="edit" initialData={quotationWithItems} />;
}