import Link from 'next/link';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyProductsStateProps {
    hasFilters?: boolean;
}

export function EmptyProductsState({ hasFilters }: EmptyProductsStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-base font-semibold">
                {hasFilters ? 'No products match your filters' : 'No products yet'}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                {hasFilters
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Get started by adding your first product. Products are complete items you supply to customers.'}
            </p>
            {!hasFilters && (
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add your first product
                    </Link>
                </Button>
            )}
        </div>
    );
}