'use client';

import { Controller, type Control } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RichTextEditor } from '@/features/services/components/RichTextEditor';
import type { QuotationFormData } from '../schema';

interface TermsEditorProps {
    control: Control<QuotationFormData>;
}

export function TermsEditor({ control }: TermsEditorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Terms & Conditions
                </CardTitle>
                <CardDescription>
                    The terms that will appear on the PDF quotation sent to the customer.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            placeholder="Payment terms, delivery conditions, warranty details..."
                        />
                    )}
                />
            </CardContent>
        </Card>
    );
}