import { Suspense } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getServices
} from '@/features/services/queries';
import { ServiceFilters } from '@/features/services/types';
import { ServiceFilters as ServiceFiltersComponent } from '@/features/services/components/ServiceFilters';
import { ServicesTable } from '@/features/services/components/ServicesTable';
import { EmptyServicesState } from '@/features/services/components/EmptyServicesState';
import { ServicesSkeleton } from '@/features/services/components/ServicesSkeleton';

interface ServicesPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        featured?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
    const params = await searchParams;

    const filters: ServiceFilters = {
        search: params.search,
        status: (params.status as ServiceFilters['status']) ?? 'all',
        featured: params.featured === 'true' ? true : params.featured === 'false' ? false : 'all',
        sortBy: (params.sortBy as ServiceFilters['sortBy']) ?? 'created_at',
        sortOrder: (params.sortOrder as ServiceFilters['sortOrder']) ?? 'desc',
    };

    const services = await getServices(filters);
    const hasFilters = !!(filters.search || filters.status !== 'all' || filters.featured !== 'all');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Services</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the branding services you offer to customers.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/services/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Service
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ServiceFiltersComponent />

            {/* Content */}
            <Suspense fallback={<ServicesSkeleton />}>
                {services.length === 0 ? (
                    <EmptyServicesState hasFilters={hasFilters} />
                ) : (
                    <ServicesTable services={services} />
                )}
            </Suspense>
        </div>
    );
}