import Link from 'next/link';
import { Tags, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCategoriesStateProps {
    hasFilters?: boolean;
}

export function EmptyCategoriesState({ hasFilters }: EmptyCategoriesStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Tags className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-base font-semibold">
                {hasFilters ? 'No categories match your filters' : 'No categories yet'}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                {hasFilters
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Categories help organize your services and products into logical groups like "Clothing" or "Signage".'}
            </p>
            {!hasFilters && (
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first category
                    </Link>
                </Button>
            )}
        </div>
    );
}