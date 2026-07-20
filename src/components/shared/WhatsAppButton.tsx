import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
    phone: string;
    message: string;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    children?: React.ReactNode;
    className?: string;
}

export function WhatsAppButton({
    phone,
    message,
    variant = "outline",
    size = "default",
    children,
    className,
}: WhatsAppButtonProps) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    return (
        <Button variant={variant} size={size} asChild className={className}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                {children || "WhatsApp"}
            </a>
        </Button>
    );
}

export function WhatsAppIconButton({
    phone,
    message,
    size = "sm",
    className,
}: Omit<WhatsAppButtonProps, "children" | "variant">) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    return (
        <Button variant="outline" size={size} asChild className={className}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-3 w-3" />
            </a>
        </Button>
    );
}