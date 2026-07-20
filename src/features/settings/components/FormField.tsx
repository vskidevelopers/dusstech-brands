import { Label } from '@/components/ui/label';

interface FormFieldProps {
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
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