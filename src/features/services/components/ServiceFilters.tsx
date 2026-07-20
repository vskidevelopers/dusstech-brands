'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export function ServiceFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const status = searchParams.get('status') ?? 'all';
    const featured = searchParams.get('featured') ?? 'all';

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === 'all') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, value);
                }
            });
            return newParams.toString();
        },
        [searchParams]
    );

    const updateFilter = (key: string, value: string) => {
        router.push(`${pathname}?${createQueryString({ [key]: value })}`);
    };

    const clearAll = () => {
        router.push(pathname);
    };

    const hasFilters = search !== '' || status !== 'all' || featured !== 'all';

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search services..."
                    defaultValue={search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-9"
                />
            </div>

            <Select value={status} onValueChange={(v) => updateFilter('status', v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Archived</SelectItem>
                </SelectContent>
            </Select>

            <Select value={featured} onValueChange={(v) => updateFilter('featured', v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Featured</SelectItem>
                    <SelectItem value="false">Not featured</SelectItem>
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-9">
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    Clear
                </Button>
            )}
        </div>
    );
}