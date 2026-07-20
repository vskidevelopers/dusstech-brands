'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { FeaturedToggle } from './FeaturedToggle';
import { ActiveToggle } from './ActiveToggle';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import type { Service } from '../types';

interface ServicesTableProps {
    services: Service[];
}

function formatPrice(price: number | null, pricingType: string): string {
    if (price === null || price === 0) return '—';
    const formatted = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    }).format(price);

    if (pricingType === 'custom_quote') return 'Quote';
    if (pricingType === 'starting_from') return `From ${formatted}`;
    return formatted;
}

export function ServicesTable({ services }: ServicesTableProps) {
    const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

    if (services.length === 0) return null;

    return (
        <>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden sm:table-cell">Price</TableHead>
                            <TableHead className="text-center">Featured</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Updated</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id} className="group">
                                <TableCell>
                                    <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                                        {service.featured_image ? (
                                            <img
                                                src={service.featured_image}
                                                alt={service.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                —
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/admin/services/${service.id}/edit`}
                                        className="font-medium hover:text-primary hover:underline"
                                    >
                                        {service.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">/{service.slug}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                    {service.category || '—'}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell tabular-nums">
                                    {formatPrice(service.starting_price, service.pricing_type)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <FeaturedToggle service={service} />
                                </TableCell>
                                <TableCell>
                                    <ServiceStatusBadge active={service.active} />
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                    {format(new Date(service.updated_at), 'MMM d, yyyy')}
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
                                                <Link href={`/admin/services/${service.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { }}>
                                                <ActiveToggle service={service} />
                                                <span>{service.active ? 'Archive' : 'Restore'}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => setDeleteTarget(service)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Archive
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {deleteTarget && (
                <DeleteServiceDialog
                    serviceId={deleteTarget.id}
                    serviceName={deleteTarget.name}
                    open={!!deleteTarget}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                />
            )}
        </>
    );
}