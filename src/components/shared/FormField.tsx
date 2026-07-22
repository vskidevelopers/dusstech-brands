"use client";

import * as React from "react";
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

// ✅ FIXED: Properly forwards ref for React Hook Form compatibility
export const InputField = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        label: string;
        error?: string;
        hint?: string;
    }
>(({ label, error, hint, className, ...props }, ref) => {
    return (
        <FormField label={label} error={error} hint={hint} required={props.required}>
            <Input ref={ref} className={cn(error && "border-destructive", className)} {...props} />
        </FormField>
    );
});
InputField.displayName = "InputField";

// ✅ FIXED: Properly forwards ref for React Hook Form compatibility
export const TextareaField = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        label: string;
        error?: string;
        hint?: string;
    }
>(({ label, error, hint, className, ...props }, ref) => {
    return (
        <FormField label={label} error={error} hint={hint} required={props.required}>
            <Textarea ref={ref} className={cn(error && "border-destructive", className)} {...props} />
        </FormField>
    );
});
TextareaField.displayName = "TextareaField";