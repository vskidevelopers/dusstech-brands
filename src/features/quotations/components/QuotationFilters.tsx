'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function QuotationFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status') ?? 'all';

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === 'all') newParams.delete(key);
                else newParams.set(key, value);
            });
            newParams.delete('page'); // Reset to page 1 on filter change
            return newParams.toString();
        },
        [searchParams]
    );

    const updateFilter = (key: string, value: string) => {
        const qs = createQueryString({ [key]: value });
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    const clearAll = () => router.push(pathname);
    const hasFilters = search !== '' || status !== 'all';

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search customer or quote #"
                    defaultValue={search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-9"
                />
            </div>

            <Select value={status} onValueChange={(v) => updateFilter('status', v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
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