import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, FileText, MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/shared/Pagination';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/supabase/requireAuth';
import { QuotationFilters } from '@/features/quotations/components/QuotationFilters';
import { QuotationStatusBadge } from '@/features/quotations/components/QuotationStatusBadge';
import type { QuotationStatus } from '@/features/quotations/types';

interface QuotationsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        page?: string;
        pageSize?: string;
    }>;
}

export default async function QuotationsPage({ searchParams }: QuotationsPageProps) {
    await requireAuth();
    const params = await searchParams;

    const page = params.page ? parseInt(params.page, 10) : 1;
    const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : DEFAULT_PAGE_SIZE;
    const search = params.search?.trim() || '';
    const status = (params.status as QuotationStatus | 'all') || 'all';

    const supabase = await createClient();
    let query = supabase.from('quotations').select('*', { count: 'exact' });

    if (status !== 'all') query = query.eq('status', status);

    if (search) {
        query = query.or(`customer_name.ilike.%${search}%,company_name.ilike.%${search}%,quote_number.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: quotations, error, count } = await query;

    if (error) {
        console.error('Failed to fetch quotations:', error);
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const hasFilters = !!search || status !== 'all';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
                    <p className="text-sm text-muted-foreground">
                        Create, manage, and track customer quotations.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/quotations/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Quotation
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <QuotationFilters />

            {/* Content */}
            {totalCount === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 text-base font-semibold">
                        {hasFilters ? 'No quotations match your filters' : 'No quotations yet'}
                    </h3>
                    <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                        {hasFilters
                            ? 'Try adjusting your search or filters.'
                            : 'Get started by creating your first quotation for a customer.'}
                    </p>
                    {!hasFilters && (
                        <Button asChild>
                            <Link href="/admin/quotations/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Quotation
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quote Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead className="hidden md:table-cell">Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotations?.map((q) => (
                                    <TableRow key={q.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/quotations/${q.id}/edit`} className="hover:text-primary hover:underline">
                                                {q.quote_number}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{q.customer_name}</TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {q.company_name || '—'}
                                        </TableCell>
                                        <TableCell>
                                            <QuotationStatusBadge status={q.status as QuotationStatus} />
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            KES {Number(q.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                            {format(new Date(q.created_at), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/quotations/${q.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/quotations/${q.id}/edit?duplicate=true`}>
                                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination page={page} pageSize={pageSize} totalCount={totalCount} />
                </>
            )}
        </div>
    );
}