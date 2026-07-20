import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
    id: string;
    title: string;
    description?: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export function SectionCard({ id, title, description, icon: Icon, children }: SectionCardProps) {
    return (
        <Card id={id} className="scroll-mt-24">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    {title}
                </CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}