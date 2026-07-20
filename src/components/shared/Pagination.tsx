'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface PaginationProps {
    page: number;
    pageSize: number;
    totalCount: number;
    className?: string;
}

export function Pagination({ page, pageSize, totalCount, className }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalCount);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === null) newParams.delete(key);
                else newParams.set(key, value);
            });
            return newParams.toString();
        },
        [searchParams]
    );

    const updateParam = (key: string, value: string) => {
        router.push(`${pathname}?${createQueryString({ [key]: value })}`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        updateParam('page', newPage.toString());
    };

    const handlePageSizeChange = (newSize: string) => {
        // Reset to page 1 when changing page size
        const qs = createQueryString({ pageSize: newSize, page: null });
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    return (
        <div className={cn('flex flex-col items-center justify-between gap-4 sm:flex-row', className)}>
            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{startItem}</span>
                –<span className="font-medium text-foreground">{endItem}</span> of{' '}
                <span className="font-medium text-foreground">{totalCount}</span>
            </p>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="pageSize" className="text-sm text-muted-foreground whitespace-nowrap">
                        Rows per page:
                    </label>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger id="pageSize" className="w-[70px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm tabular-nums min-w-[60px] text-center">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}