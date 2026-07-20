import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormField({ label, error, required, hint, children, className }: FormFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
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

interface InputFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export function InputField({
    label,
    error,
    required,
    hint,
    type = "text",
    placeholder,
    value,
    onChange,
    disabled,
}: InputFieldProps) {
    return (
        <FormField label={label} error={error} required={required} hint={hint}>
            <Input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={error && "border-destructive"}
            />
        </FormField>
    );
}

interface TextareaFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    hint?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    disabled?: boolean;
}

export function TextareaField({
    label,
    error,
    required,
    hint,
    placeholder,
    value,
    onChange,
    rows = 3,
    disabled,
}: TextareaFieldProps) {
    return (
        <FormField label={label} error={error} required={required} hint={hint}>
            <Textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
                disabled={disabled}
                className={error && "border-destructive"}
            />
        </FormField>
    );
}