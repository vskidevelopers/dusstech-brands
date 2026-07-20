'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function OrderFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const productionStatus = searchParams.get('productionStatus') ?? 'all';
    const paymentStatus = searchParams.get('paymentStatus') ?? 'all';
    const source = searchParams.get('source') ?? 'all';

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === 'all') newParams.delete(key);
                else newParams.set(key, value);
            });
            newParams.delete('page');
            return newParams.toString();
        },
        [searchParams]
    );

    const updateFilter = (key: string, value: string) => {
        const qs = createQueryString({ [key]: value });
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    const clearAll = () => router.push(pathname);
    const hasFilters = search !== '' || productionStatus !== 'all' || paymentStatus !== 'all' || source !== 'all';

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search customer, phone, or order #"
                    defaultValue={search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-9"
                />
            </div>

            <Select value={productionStatus} onValueChange={(v) => updateFilter('productionStatus', v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Production" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Production</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="artwork">Artwork</SelectItem>
                    <SelectItem value="production">In Production</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>

            <Select value={paymentStatus} onValueChange={(v) => updateFilter('paymentStatus', v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
            </Select>

            <Select value={source} onValueChange={(v) => updateFilter('source', v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="quotation">Quotation</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-9">
                    <X className="mr-1.5 h-3.5 w-3.5" /> Clear
                </Button>
            )}
        </div>
    );
}