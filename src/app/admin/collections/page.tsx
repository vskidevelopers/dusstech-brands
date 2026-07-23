import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getCollections, CollectionFilters, CollectionsTable, CollectionsSkeleton, EmptyCollectionsState,
} from '@/features/collections';
import { CollectionFilters as ColFils } from '@/features/collections/components/CollectionFilters';
interface CollectionsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        featured?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
    const params = await searchParams;

    const filters: CollectionFilters = {
        search: params.search,
        status: (params.status as CollectionFilters['status']) ?? 'all',
        featured: params.featured === 'true' ? true : params.featured === 'false' ? false : 'all',
        sortBy: (params.sortBy as CollectionFilters['sortBy']) ?? 'created_at',
        sortOrder: (params.sortOrder as CollectionFilters['sortOrder']) ?? 'desc',
    };

    const collections = await getCollections(filters);
    const hasFilters = !!(filters.search || filters.status !== 'all' || filters.featured !== 'all');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
                    <p className="text-sm text-muted-foreground">
                        Marketing groupings to organize products and services.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/collections/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Collection
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ColFils />

            {/* Content */}
            {collections.length === 0 ? (
                <EmptyCollectionsState hasFilters={hasFilters} />
            ) : (
                <CollectionsTable collections={collections} />
            )}
        </div>
    );
}