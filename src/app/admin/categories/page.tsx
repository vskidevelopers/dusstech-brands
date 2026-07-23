import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getCategories, CategoryFilters
} from '@/features/categories';
import { CategoriesTable } from '@/features/categories/components/CategoriesTable';
import { EmptyCategoriesState } from '@/features/categories/components/EmptyCategoriesState';

import { CategoryFilters as CatFilters } from '@/features/categories/components/CategoryFilters';

interface CategoriesPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        featured?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
    const params = await searchParams;

    const filters: CategoryFilters = {
        search: params.search,
        status: (params.status as CategoryFilters['status']) ?? 'all',
        featured: params.featured === 'true' ? true : params.featured === 'false' ? false : 'all',
        sortBy: (params.sortBy as CategoryFilters['sortBy']) ?? 'sort_order',
        sortOrder: (params.sortOrder as CategoryFilters['sortOrder']) ?? 'asc',
    };

    const categories = await getCategories(filters);
    const hasFilters = !!(filters.search || filters.status !== 'all' || filters.featured !== 'all');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-sm text-muted-foreground">
                        Organize your services and products into logical groups.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Category
                    </Link>
                </Button>
            </div>

            <CatFilters />

            {categories.length === 0 ? (
                <EmptyCategoriesState hasFilters={hasFilters} />
            ) : (
                <CategoriesTable categories={categories} />
            )}
        </div>
    );
}