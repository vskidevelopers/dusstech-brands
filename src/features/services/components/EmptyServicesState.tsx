import Link from 'next/link';
import { Wrench, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyServicesStateProps {
    hasFilters?: boolean;
}

export function EmptyServicesState({ hasFilters }: EmptyServicesStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Wrench className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-base font-semibold">
                {hasFilters ? 'No services match your filters' : 'No services yet'}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                {hasFilters
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Get started by creating your first branding service. It will appear on the public website once active.'}
            </p>
            {!hasFilters && (
                <Button asChild>
                    <Link href="/admin/services/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first service
                    </Link>
                </Button>
            )}
        </div>
    );
}