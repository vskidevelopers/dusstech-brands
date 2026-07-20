import Link from 'next/link';
import { FolderHeart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCollectionsStateProps {
    hasFilters?: boolean;
}

export function EmptyCollectionsState({ hasFilters }: EmptyCollectionsStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <FolderHeart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-base font-semibold">
                {hasFilters ? 'No collections match your filters' : 'No collections yet'}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                {hasFilters
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Collections are marketing groupings like "Popular" or "Holiday Offers" that you can assign to products and services.'}
            </p>
            {!hasFilters && (
                <Button asChild>
                    <Link href="/admin/collections/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first collection
                    </Link>
                </Button>
            )}
        </div>
    );
}