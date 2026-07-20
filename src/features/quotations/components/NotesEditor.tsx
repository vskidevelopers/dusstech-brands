'use client';

import { Controller, type Control } from 'react-hook-form';
import { StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RichTextEditor } from '@/features/services/components/RichTextEditor';
import type { QuotationFormData } from '../schema';

interface NotesEditorProps {
    control: Control<QuotationFormData>;
}

export function NotesEditor({ control }: NotesEditorProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                    Notes
                </CardTitle>
                <CardDescription>
                    Internal notes or additional information for the customer.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            placeholder="Add any notes or special instructions..."
                        />
                    )}
                />
            </CardContent>
        </Card>
    );
}