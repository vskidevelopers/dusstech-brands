import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/Pagination';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import {
    getProducts,
    ProductsTable,
    ProductFilters,
    EmptyProductsState,
} from '@/features/products';
import type { ProductFilters as ProductFiltersType } from '@/features/products/types';

interface ProductsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        featured?: string;
        newArrival?: string;
        popular?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: string;
        pageSize?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;

    const filters: ProductFiltersType = {
        search: params.search,
        status: (params.status as ProductFiltersType['status']) ?? 'all',
        featured:
            params.featured === 'true'
                ? true
                : params.featured === 'false'
                    ? false
                    : 'all',
        newArrival:
            params.newArrival === 'true'
                ? true
                : params.newArrival === 'false'
                    ? false
                    : 'all',
        popular:
            params.popular === 'true'
                ? true
                : params.popular === 'false'
                    ? false
                    : 'all',
        sortBy: (params.sortBy as ProductFiltersType['sortBy']) ?? 'created_at',
        sortOrder: (params.sortOrder as ProductFiltersType['sortOrder']) ?? 'desc',
        page: params.page ? parseInt(params.page, 10) : 1,
        pageSize: params.pageSize ? parseInt(params.pageSize, 10) : DEFAULT_PAGE_SIZE,
    };

    const result = await getProducts(filters);

    const hasFilters = !!(
        filters.search ||
        filters.status !== 'all' ||
        filters.featured !== 'all' ||
        filters.newArrival !== 'all' ||
        filters.popular !== 'all'
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the complete items you supply to customers.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Product
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ProductFilters />

            {/* Content */}
            {result.data.length === 0 ? (
                <EmptyProductsState hasFilters={hasFilters} />
            ) : (
                <>
                    <ProductsTable products={result.data} />
                    <Pagination
                        page={result.page}
                        pageSize={result.pageSize}
                        totalCount={result.count}
                    />
                </>
            )}
        </div>
    );
}