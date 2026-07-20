'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
}

export function ColorPicker({ label, value, onChange, error, hint }: ColorPickerProps) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
                <div
                    className="h-10 w-10 shrink-0 rounded-md border shadow-sm"
                    style={{ backgroundColor: value }}
                    aria-hidden
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    maxLength={7}
                    className={cn('font-mono uppercase', error && 'border-destructive')}
                />
            </div>
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}